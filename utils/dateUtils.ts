import moment from 'moment';
import 'moment/locale/fr';

// moment.locale('fr'); // ne fonctionne pas

moment.updateLocale('fr', {
    relativeTime: {
        future: 'dans %s',
        past: 'il y a %s',
        s: 'quelques secondes',
        ss: '%d secondes',
        m: 'une minute',
        mm: '%d minutes',
        h: 'une heure',
        hh: '%d heures',
        d: 'un jour',
        dd: '%d jours',
        M: 'un mois',
        MM: '%d mois',
        y: 'un an',
        yy: '%d ans'
    }
});

export const formatDate = (date: Date, withoutSuffix = false): string => {
    return moment(date).fromNow(withoutSuffix);
};