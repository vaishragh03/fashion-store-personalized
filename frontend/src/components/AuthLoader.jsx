import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrateAuth } from '../store/authSlice';

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return children;
};

export default AuthLoader;
