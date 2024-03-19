import { SVGProps } from "react";
import { styled } from "@mui/material/styles";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 43.1 85.9"
    {...props}
  >
    <path
      d="M11.3 2.5c-5.8 5-8.7 12.7-9 20.3s2 15.1 5.3 22c6.7 14 18 25.8 31.7 33.1"
      className="st0 draw-arrow"
      strokeLinecap="round"
    />
    <path
      d="M40.6 78.1C39 71.3 37.2 64.6 35.2 58"
      className="draw-arrow tail-1"
      strokeLinecap="round"
    />
    <path
      d="M39.8 78.5c-7.2 1.7-14.3 3.3-21.5 4.9"
      className="draw-arrow tail-2"
      strokeLinecap="round"
    />
  </svg>
);

const StyledArrow = styled(SvgComponent)`
  position: fixed;
  top: 50px;
  left: 40px;
  width: 50px;
  height: 75px;
  margin: 0 auto;
  transform: rotate(110deg) scaleX(-1);
  display: none;
  .draw-arrow {
    stroke-width: 4;
    stroke: black;
    fill: none;
    stroke-dasharray: 400;
    stroke-dashoffset: 400;
    animation-duration: 1.75s;
    animation-delay: 1s;
    animation-fill-mode: forwards;
    animation-name: draw;
    &.tail-1 {
      animation-delay: 1.4s;
    }
    &.tail-2 {
      animation-delay: 1.6s;
    }
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    display: block;
  }
  
  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }
`;
export default StyledArrow;
