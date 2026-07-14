import {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import propTypes from 'prop-types';
import { SH } from '../../utils';

function Spacing({space, horizontal, backgroundColor}) {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        spacerStyle: {
          [horizontal ? 'width' : 'height']: space,
          backgroundColor: backgroundColor || 'transparent',
        },
      }),
    [horizontal, space, backgroundColor],
  );
  return <View style={[styles.spacerStyle]} />;
}

Spacing.propTypes = {
  space: propTypes.number || propTypes.string,
  horizontal: propTypes.bool,
  backgroundColor: propTypes.string,
};
export default Spacing;
