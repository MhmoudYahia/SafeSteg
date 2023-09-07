import { useState, useEffect } from 'react';

export const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [status, setSt] = useState(0);
  const [message, setMess] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch(url, {
      credentials: 'include',
      withCredentials: true,
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
        setUser(data.user);
        setSt(data.status);
        setMess(data.message);
        setLoading(false);
      });
  }, [url]);
  return { status, data, message, loading, user };
};
