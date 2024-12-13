import React from "react";

function Footer() {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Homemade. All rights reserved.</p>
    </footer>
  );
}

const styles = {
  footer: {
    textAlign: "center",
    padding: "1rem",
    backgroundColor: "#FFBB93",
    color: "#fff",
  },
};

export default Footer;
