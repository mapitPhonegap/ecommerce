import { useDidMount } from '@/hooks';
import { useEffect, useState } from 'react';
import supabase from '@/services/supabase';

const useRecommendedProducts = (itemsCount) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);

  const fetchRecommendedProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const docs = await supabase.getRecommendedProducts(itemsCount);

      if (docs.empty) {
        if (didMount) {
          setError('No recommended products found.');
          setLoading(false);
        }
      } else {

        if (didMount) {
          setRecommendedProducts(docs);
          setLoading(false);
        }
      }
    } catch (e) {
      if (didMount) {
        setError('Failed to fetch recommended products');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (recommendedProducts.length === 0 && didMount) {
      fetchRecommendedProducts();
    }
  }, []);


  return {
    recommendedProducts, fetchRecommendedProducts, isLoading, error
  };
};

export default useRecommendedProducts;
