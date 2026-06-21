import { Link } from 'react-router-dom';
import TrustMark from './TrustMark';
import { formatAuthorName } from '../utils/user';

type AuthorAttributionProps = {
  name: string;
  userId?: string | null;
  isRecognized?: boolean;
  className?: string;
  nameClassName?: string;
  linkToProfile?: boolean;
};

const AuthorAttribution = ({
  name,
  userId,
  isRecognized = false,
  className = '',
  nameClassName = '',
  linkToProfile = false,
}: AuthorAttributionProps) => {
  const formattedName = formatAuthorName(name);
  const content = (
    <>
      <span className={nameClassName}>{formattedName}</span>
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

  return <span className={layoutClass}>{content}</span>;
};

export default AuthorAttribution;
