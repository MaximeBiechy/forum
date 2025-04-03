import moment from 'moment';
import 'moment/locale/fr';

export const formatDate = (date: Date, withoutSuffix = false): string => {
    moment.locale('fr');
    return moment(date).fromNow(withoutSuffix);
};