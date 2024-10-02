import './styles.scss';

export const Spinner: React.FC = () => (
  <svg className="spin" width="64px" height="64px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
    <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
  </svg>
);
