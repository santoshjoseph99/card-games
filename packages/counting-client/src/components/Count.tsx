import React from 'react';

export interface ICountProps {
  count: number;
}

const Count = (props: ICountProps) => {
  const [showCount, setShowCount] = React.useState(true);
  const toggleCount = React.useCallback(() => setShowCount(!showCount), [showCount])
  return (
    <div>
      <button onClick={toggleCount}>{showCount ? 'Hide Count' : 'Show Count'}</button>
      {showCount && <span>{props.count}</span>}
    </div>);
}

export default Count;