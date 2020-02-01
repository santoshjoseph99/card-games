import React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';

export interface ICountProps {
  count: number;
}

const Count = (props: ICountProps) => {
  const [showCount, setShowCount] = React.useState(false);
  const toggleCount = React.useCallback(() => setShowCount(!showCount), [showCount])
  return (
    <div>
      <PrimaryButton onClick={toggleCount} text={showCount ? 'Hide Count' : 'Show Count'}></PrimaryButton>
      {showCount && <Label>{props.count}</Label>}
    </div>);
}

export default Count;