import { useState, useEffect } from 'react';

function Countdown() {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(seconds - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  if (seconds === 1) {
    window.location.replace("/");
  }
  if (seconds === 0) {
    window.location.replace("/");
    return <div>Time's up!</div>;
  }

  return <div>You have {seconds} seconds remaining here</div>;
}

export default Countdown;
