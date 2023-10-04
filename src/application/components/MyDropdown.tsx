import React from "react";

type Props = {
  button: React.ReactNode;
  children: React.ReactNode;
};

function MyDropdown({ button, children }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onBlur={() => {
          if (!ref.current?.matches(":hover")) {
            setOpen(false);
          }
        }}
        className={`${
          open ? "bg-secondary" : ""
        } rounded-md transition hover:bg-secondary`}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        {button}
      </button>
      <div
        ref={ref}
        onMouseLeave={() => {
          setOpen(false);
        }}
        className={`absolute grid duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        } shadow min-w-full top-full mt-1 bg-white rounded-md overflow-hidden`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export default MyDropdown;
