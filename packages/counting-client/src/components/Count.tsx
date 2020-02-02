import React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { StyleSheet, css } from 'aphrodite';

export interface ICountProps {
  count: number;
}

const Count = (props: ICountProps) => {
  const [showCount, setShowCount] = React.useState(false);
  const toggleCount = React.useCallback(() => setShowCount(!showCount), [showCount]);

  return (
    <div className={css(styles.countContainer)}>
      <PrimaryButton onClick={toggleCount} text={showCount ? 'Hide Count' : 'Show Count'}></PrimaryButton>
      {showCount && <Label className={css(styles.count)}>{props.count}</Label>}
    </div>);
}

const styles = StyleSheet.create({
  count: {
    paddingLeft: 50,
  },
  countContainer: {
    paddingTop: 20
  }
});

export default Count;