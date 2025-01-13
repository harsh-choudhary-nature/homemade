

const Chip = ({ label, color }) => {
    return (
        <div
        className="chip"
        style={{
            backgroundColor: color,
        }}
        >
        {label}
        </div>
    );
    };
