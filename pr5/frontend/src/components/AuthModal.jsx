import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' или 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, first_name: firstName, last_name: lastName, password });
      }
      onClose(); // закрываем модалку после успеха
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при выполнении операции');
    }
  };

  if (!open) return null;

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <div className="modal__title">{mode === 'login' ? 'Вход' : 'Регистрация'}</div>
          <button className="iconBtn" onClick={onClose}>✕</button>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <label className="label">
            Email
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          {mode === 'register' && (
            <>
              <label className="label">
                Имя
                <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </label>
              <label className="label">
                Фамилия
                <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </label>
            </>
          )}
          <label className="label">
            Пароль
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <div className="modal__footer" style={{ justifyContent: 'space-between' }}>
            <button type="button" className="btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}