/* eslint-disable max-len */
import { BasketItem, BasketToggle } from '@/components/basket';
import { Boundary, Modal } from '@/components/common';
import { CHECKOUT_STEP_1 } from '@/constants/routes';
import { createClient } from '@supabase/supabase-js';
import { calculateTotal, displayMoney } from '@/helpers/utils';
import { useDidMount, useModal } from '@/hooks';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { clearBasket } from '@/redux/actions/basketActions';
import supabase from '@/services/supabase';

const Basket = () => {
  const { isOpenModal, onOpenModal, onCloseModal } = useModal();
  const { basket } = useSelector((state) => ({
    basket: state.basket,
  }));
  const [user, setUser] = useState(null);
  const history = useHistory();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const didMount = useDidMount();

  // Get the authenticated user from Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user);
    };
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });
  
    fetchUser();
  
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Save basket items to Supabase when the basket updates
  useEffect(() => {
    if (didMount && user && basket.length !== 0) {
      const saveBasket = async () => {
        try {
          const { error } = await supabase
            .from('baskets')
            .upsert({ user_id: user.id, items: basket }, { onConflict: ['user_id'] });

          if (error) throw error;
          console.log('Item saved to basket');
        } catch (e) {
          console.error('Error saving basket:', e.message);
        }
      };
      saveBasket();
    }
  }, [basket.length, user]);

  const onCheckOut = () => {
    if (basket.length !== 0 && user) {
      document.body.classList.remove('is-basket-open');
      history.push(CHECKOUT_STEP_1);
    } else {
      onOpenModal();
    }
  };

  const onSignInClick = () => {
    onCloseModal();
    document.body.classList.remove('basket-open');
    history.push(CHECKOUT_STEP_1);
  };

  const onClearBasket = () => {
    if (basket.length !== 0) {
      dispatch(clearBasket());
    }
  };

  return user && user.role === 'ADMIN' ? null : (
    <Boundary>
      <Modal isOpen={isOpenModal} onRequestClose={onCloseModal}>
        <p className="text-center">You must sign in to continue checking out</p>
        <br />
        <div className="d-flex-center">
          <button
            className="button button-border button-border-gray button-small"
            onClick={onCloseModal}
            type="button"
          >
            Continue shopping
          </button>
          &nbsp;
          <button
            className="button button-small"
            onClick={onSignInClick}
            type="button"
          >
            Sign in to checkout
          </button>
        </div>
      </Modal>
      <div className="basket">
        <div className="basket-list">
          <div className="basket-header">
            <h3 className="basket-header-title">
              My Basket &nbsp;
              <span>
                (
                {` ${basket.length} ${basket.length > 1 ? 'items' : 'item'}`}
                )
              </span>
            </h3>
            <BasketToggle>
              {({ onClickToggle }) => (
                <span
                  className="basket-toggle button button-border button-border-gray button-small"
                  onClick={onClickToggle}
                  role="presentation"
                >
                  Close
                </span>
              )}
            </BasketToggle>
            <button
              className="basket-clear button button-border button-border-gray button-small"
              disabled={basket.length === 0}
              onClick={onClearBasket}
              type="button"
            >
              <span>Clear Basket</span>
            </button>
          </div>
          {basket.length <= 0 && (
            <div className="basket-empty">
              <h5 className="basket-empty-msg">Your basket is empty</h5>
            </div>
          )}
          {basket.map((product, i) => (
            <BasketItem
              key={`${product.id}_${i}`}
              product={product}
              basket={basket}
              dispatch={dispatch}
            />
          ))}
        </div>
        <div className="basket-checkout">
          <div className="basket-total">
            <p className="basket-total-title">Subtotal Amount:</p>
            <h2 className="basket-total-amount">
              {displayMoney(calculateTotal(basket.map((product) => product.price * product.quantity)))}
            </h2>
          </div>
          <button
            className="basket-checkout-button button"
            disabled={basket.length === 0 || pathname === '/checkout'}
            onClick={onCheckOut}
            type="button"
          >
            Check Out
          </button>
        </div>
      </div>
    </Boundary>
  );
};

export default Basket;