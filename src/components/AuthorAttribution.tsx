import { Link } from 'react-router-dom';
import FoundingTasterMark from './FoundingTasterMark';
import TrustMark from './TrustMark';
import { formatAuthorName } from '../utils/user';

type AuthorAttributionProps = {
  name: string;
  userId?: string | null;
  isFoundingTaster?: boolean;
  isRecognized?: boolean;
  className?: string;
  nameClassName?: string;
  linkToProfile?: boolean;
  asHeading?: boolean;
};

const AuthorAttribution = ({
  name,
  userId,
  isFoundingTaster = false,
  isRecognized = false,
  className = '',
  nameClassName = '',
  linkToProfile = false,
  asHeading = false,
}: AuthorAttributionProps) => {
  const formattedName = formatAuthorName(name);
  const content = (
    <>
      <span className={nameClassName}>{formattedName}</span>
      {isFoundingTaster && <FoundingTasterMark className="mt-0.5" />}
      {isRecognized && <TrustMark className="mt-0.5" />}
    </>
  );

  const layoutClass = `inline-flex items-center gap-1.5 ${className}`.trim();

  if (linkToProfile && userId) {
    return (
      <Link to={`/user/${userId}`} className={`${layoutClass} hover:text-cream transition-colors`}>
        {content}
      </Link>
    );
  }

  if (asHeading) {
    return <h1 className={layoutClass}>{content}</h1>;
  }

  return <span className={layoutClass}>{content}</span>;
};

export default AuthorAttribution;
