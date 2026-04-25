"use client";

export default function SearchButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
    >
      <img
        src="/SearchIcon.png"
        alt="Search"
        width={50}
        height={50}
      />
    </button>
  );
}