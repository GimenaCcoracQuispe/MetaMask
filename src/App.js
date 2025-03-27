import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
  
      // Esperar un poco antes de intentar la conexión
      const timeoutId = setTimeout(() => {
        window.ethereum.request({ method: 'eth_requestAccounts' })
          .then(accounts => {
            setAccount(accounts[0]);
            getBalance(accounts[0], web3Instance);
          })
          .catch((error) => {
            console.error('User rejected the request');
          });
      }, 1000);  // Espera 1 segundo
  
      return () => clearTimeout(timeoutId);  // Limpiar el tiempo de espera cuando el componente se desmonta
    } else {
      alert('MetaMask no está instalado. Por favor, instálalo.');
    }
  }, []);
  

  const getBalance = async (account, web3Instance) => {
    const balance = await web3Instance.eth.getBalance(account);
    setBalance(web3Instance.utils.fromWei(balance, 'ether'));
  };

  const sendTransaction = async () => {
    if (!web3 || !account) {
      alert("Conecta MetaMask primero.");
      return;
    }
  
    const recipient = prompt('Introduce la dirección del destinatario:');
    const amount = prompt('Introduce la cantidad de Ether a enviar:');
    
    if (recipient && amount) {
      const transaction = {
        to: recipient,
        from: account,
        value: web3.utils.toWei(amount, 'ether'),
      };
  
      try {
        await web3.eth.sendTransaction(transaction);
        alert('Transacción completada!');
      } catch (error) {
        alert('Error al enviar la transacción');
        console.error(error);
      }
    }
  };
  

  return (
    <div className="App">
      <h1>Conecta MetaMask</h1>
      {account ? (
        <>
          <p>Dirección de la cuenta: {account}</p>
          <p>Saldo: {balance} ETH</p>
          <button onClick={sendTransaction}>Enviar Ether</button>
        </>
      ) : (
        <p>Conéctate a MetaMask</p>
      )}
    </div>
  );
}

export default App;
