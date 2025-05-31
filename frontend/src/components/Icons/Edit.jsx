export default function Edit({ onClick, className, ariaLabel, style }) {

    return (
        <button
            type="button"
            onClick={onClick}
            className={className}
            aria-label={ariaLabel}
            style={style}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                className="w-5 h-5"
            >
                <path d="M15.232 5.232l3.536 3.536M16.5 4.5a2.121 2.121 0 0 1 3 3L7 20.5H4v-3L16.5 4.5z" />
            </svg>
        </button>
    );
};