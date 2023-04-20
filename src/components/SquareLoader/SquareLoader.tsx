'use client';

import styled from 'styled-components';

const Loader = styled.span`
  height: 5px;
  width: 5px;
  color: #3f4257;
  box-shadow: -10px -10px 0 5px, -10px -10px 0 5px, -10px -10px 0 5px,
    -10px -10px 0 5px;
  animation: loader-38 6s infinite;

  @keyframes loader-38 {
    0% {
      box-shadow: -10px -10px 0 5px, -10px -10px 0 5px, -10px -10px 0 5px,
        -10px -10px 0 5px;
    }
    8.33% {
      box-shadow: -10px -10px 0 5px, 10px -10px 0 5px, 10px -10px 0 5px,
        10px -10px 0 5px;
    }
    16.66% {
      box-shadow: -10px -10px 0 5px, 10px -10px 0 5px, 10px 10px 0 5px,
        10px 10px 0 5px;
    }
    24.99% {
      box-shadow: -10px -10px 0 5px, 10px -10px 0 5px, 10px 10px 0 5px,
        -10px 10px 0 5px;
    }
    33.32% {
      box-shadow: -10px -10px 0 5px, 10px -10px 0 5px, 10px 10px 0 5px,
        -10px -10px 0 5px;
    }
    41.65% {
      box-shadow: 10px -10px 0 5px, 10px -10px 0 5px, 10px 10px 0 5px,
        10px -10px 0 5px;
    }
    49.98% {
      box-shadow: 10px 10px 0 5px, 10px 10px 0 5px, 10px 10px 0 5px,
        10px 10px 0 5px;
    }
    58.31% {
      box-shadow: -10px 10px 0 5px, -10px 10px 0 5px, 10px 10px 0 5px,
        -10px 10px 0 5px;
    }
    66.64% {
      box-shadow: -10px -10px 0 5px, -10px -10px 0 5px, 10px 10px 0 5px,
        -10px 10px 0 5px;
    }
    74.97% {
      box-shadow: -10px -10px 0 5px, 10px -10px 0 5px, 10px 10px 0 5px,
        -10px 10px 0 5px;
    }
    83.3% {
      box-shadow: -10px -10px 0 5px, 10px 10px 0 5px, 10px 10px 0 5px,
        -10px 10px 0 5px;
    }
    91.63% {
      box-shadow: -10px -10px 0 5px, -10px 10px 0 5px, -10px 10px 0 5px,
        -10px 10px 0 5px;
    }
    100% {
      box-shadow: -10px -10px 0 5px, -10px -10px 0 5px, -10px -10px 0 5px,
        -10px -10px 0 5px;
    }
  }
`;

export const SquareLoader: React.FC = () => {
  return <Loader />;
};
