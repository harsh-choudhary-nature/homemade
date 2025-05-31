
const Chip = ({ label, onClick }) => {
  return (
    <div className="inline-block px-4 py-2 rounded-full text-sm font-medium text-[color:var(--text-color)] bg-[color:var(--secondary-color)] border border-[color:var(--text-color)] cursor-pointer transition-colors duration-300 hover:bg-[color:var(--text-color)] hover:text-[color:var(--secondary-color)] hover:border-[color:var(--secondary-color)] mx-2 text-center" onClick={onClick}>
      {label}
    </div>
  );
};

export default Chip;
