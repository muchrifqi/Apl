:root {
    --primary-color: #172e69; /* Warna biru shahaba sd */
    --secondary-color: #2b2b2b; 
    --accent-color: #ee9d15; /* Warna biru cerah */
    --background-gradient: linear-gradient(-45deg, #2d58c4, #172e69); /* Gradien biru */
    --text-color: white; /* Warna teks putih */
    --error-color: #870900; /* Warna merah untuk pesan error */
    --success-color: #006c04; /* Warna hijau untuk pesan sukses */
    --button-hover-color: rgba(6, 158, 54, 0.758); /* Warna hijau saat hover */
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: var(--background-gradient);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
    padding: 20px;
}

@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 1rem;
    border-radius: 25px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    max-width: 800px;
    width: 90%;
    text-align: center;
    animation: fadeIn 1s ease-in-out;
    margin-top: 10px;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

.curve {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: white;
    border-radius: 0 0 50% 50%;
    transform: scaleX(1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.curve h1 {
    color: var(--primary-color);
    font-size: 2rem;
    margin: 0;
    font-weight: bold;
}

.curve h2 {
    color: var(--secondary-color);
    font-size: 1rem;
    margin: 0;
    font-weight: normal;
}

h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
}

.button-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

button {
    padding: 1rem;
    font-size: 1rem;
    background: rgba(173, 173, 173, 0.468);
    border: 2px solid rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover:not(:disabled) {
    background: var(--button-hover-color);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-5px);
}

button:disabled {
    background: rgba(0, 74, 11, 0.872);
    border-color: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
}

.footer {
    position:fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    text-align: center;
    padding: 10px 0;
    font-size: 14px;
    backdrop-filter: blur(5px);
    z-index: 1000;
}

.confirmation {
    display: none;
    margin-top: 1rem;
    animation: fadeIn 0.5s ease-in-out;
}

#statusMessage {
    color: var(--error-color);
    background: rgb(255, 255, 255);
    padding: 7px;
    max-width: 800px;
    border-radius: 10px;
    font-size: 1rem;
    margin-top: 1rem;
}

#loading {
    display: none;
    margin-top: 1rem;
    font-size: 1.2rem;
}

#loading i {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    h1 {
        font-size: 1.5rem;
    }

    .button-container {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }
}

a {
    text-decoration: none;
    padding: 10px 20px;
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-color);
    border-radius: 15px;
    cursor: pointer;
    display: inline-block;
    transition: all 0.3s ease;
}

a:hover {
    background-color: rgba(255, 251, 0, 0.251);
    transform: translateY(-5px);
}

/* Gaya untuk section pengumuman */
.announcement-section {
    width: auto;
    max-width: 500px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 1rem;
    border-radius: 25px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
    margin-top: 110px;
    text-align: center;
    animation: fadeIn 1s ease-in-out;
    color: var(--text-color);
}

.announcement-section h3 {
    color: var(--text-color);
    margin-bottom: 10px;
    font-size: 1.2rem;
}

#announcementText {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 10px;
}

.admin-button {
    background-color: #ee9d15;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.admin-button:hover {
    background-color: #e15f0e;
    transform: translateY(-2px);
}

.floating-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #e15f0e;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 0.8rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 1000;
    margin-bottom: 30px;
  }
  
  .floating-button:hover {
    background-color: #003bb3; /* Warna biru lebih gelap saat hover */
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
  
  .floating-button i {
    font-size: 0.8rem;
  }

  
