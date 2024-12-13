import React from "react";

function Home() {
  return (
    <main style={styles.container}>
      <section style={styles.hero}>
        <h1>Welcome to Homemade</h1>
        <p>Your one-stop destination for DIY inspiration and creative ideas!</p>
        <button style={styles.button}>Get Started</button>
      </section>
    </main>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#FFF4E6",
    minHeight: "80vh",
  },
  hero: {
    marginTop: "2rem",
  },
  button: {
    marginTop: "1rem",
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#FF6F61",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Home;
