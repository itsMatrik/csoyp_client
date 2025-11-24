import React from 'react';
import { Fade } from '@mui/material';

const FloatingElement = ({ children, delay = 0, ...props }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Fade in={isVisible} timeout={1000} {...props}>
      <div>{children}</div>
    </Fade>
  );
};

export default FloatingElement;