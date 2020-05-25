import {Tooltip} from 'antd';
import moment from 'moment';
import memoize from 'lodash.memoize';

export default memoize((value: number) => {
  if (value < 1) {
    return null;
  } else if (value < 10000000000) {
    value *= 1000; // convert to milliseconds
  }
  const m = moment(value);
  return (
    <Tooltip title={m.format('DD.MM.YYYY hh:mm:ss')}>
      <span>{m.fromNow()}</span>
    </Tooltip>
  );
});
