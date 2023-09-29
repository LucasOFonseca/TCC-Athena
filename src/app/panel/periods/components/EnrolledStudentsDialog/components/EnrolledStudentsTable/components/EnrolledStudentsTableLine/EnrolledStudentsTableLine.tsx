import { MinusCircleOutlined } from '@ant-design/icons';
import { StudentEnrollment } from '@athena-types/studentEnrollment';
import { Button, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Root = styled.tr`
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  td {
    height: 50px;
    padding: 0 12px;
    font-size: 1rem;
    font-weight: 600;
  }

  td:first-of-type,
  td:nth-of-type(2) {
    text-align: center;
  }

  & + & {
    td {
      border-top: 1px solid #f0f0f0;
    }
  }
`;

interface EnrolledStudentsTableLineProps {
  readOnly: boolean;
  index: number;
  enrollment: StudentEnrollment;
  onCancelEnrollment: () => void;
}

export const EnrolledStudentsTableLine: React.FC<
  EnrolledStudentsTableLineProps
> = ({ readOnly, index, enrollment, onCancelEnrollment }) => {
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  useEffect(() => {
    const keepOpen = () => {
      if (window.innerWidth <= 900 && !showDeleteButton && !readOnly) {
        setShowDeleteButton(true);
      } else if (window.innerWidth > 900 && showDeleteButton) {
        setShowDeleteButton(false);
      }
    };

    window.addEventListener('resize', keepOpen);

    return () => {
      window.removeEventListener('resize', keepOpen);
    };
  });

  return (
    <Root
      onMouseEnter={() => {
        if (readOnly) return
        
        setShowDeleteButton(true);
      }}
      onMouseLeave={() => setShowDeleteButton(false)}
    >
      <td>
        {showDeleteButton && (
          <Tooltip placement="bottom" title="Remover matrícula">
            <Button
              danger
              size="large"
              shape="circle"
              type="text"
              onClick={onCancelEnrollment}
            >
              <MinusCircleOutlined />
            </Button>
          </Tooltip>
        )}
      </td>
      <td>{index + 1}</td>
      <td>{enrollment.enrollmentNumber}</td>
      <td>{enrollment.studentName}</td>
    </Root>
  );
};
