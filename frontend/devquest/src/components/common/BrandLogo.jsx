export default function BrandLogo({
  className = '',
  iconClassName = '',
  textClassName = '',
  showText = true,
  stacked = false,
}) {
  return (
    <div
      className={`flex items-center ${stacked ? 'flex-col gap-2' : 'gap-3'} ${className}`}
    >
      <svg
        width="31"
        height="36"
        viewBox="0 0 31 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={iconClassName}
        aria-hidden="true"
      >
        <path
          d="M0 9.9855V25.5071C0 26.2288 0.388793 26.8945 1.01736 27.249L7.82203 31.0876V27.8785H10.8305V23.6667H15.0424V17.6497H9.02542V11.4322H15.0424V7.01977H19.8559V4.0113H22.4633L16.9319 0.850524C16.0096 0.323496 14.8774 0.323498 13.9551 0.850526L1.00772 8.24902C0.384572 8.6051 0 9.26779 0 9.9855Z"
          fill="#5051F9"
        />
        <path
          d="M29.718 8.41699L23.0651 4.41248V7.42095H19.856V11.8334H15.4436V14.5V17.6498H21.4606V23.6667H15.4436V28.2797H11.0312V31.4887H8.42383L13.9284 34.6342C14.865 35.1694 16.017 35.1605 16.9453 34.6109L29.7055 27.0555C30.3136 26.6954 30.6865 26.0412 30.6865 25.3345V10.1305C30.6865 9.429 30.319 8.77876 29.718 8.41699Z"
          fill="#1DA7FF"
        />
      </svg>

      {showText ? (
        <span
          className={`font-black tracking-[0.22em] text-[#5051F9] ${textClassName}`}
        >
          DEVQUEST
        </span>
      ) : null}
    </div>
  )
}
