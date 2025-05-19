import { useStyletron } from 'styletron-react';
import { LoadingSpinner } from '../common/loading-spinner';
import { Layout } from './layout';

export function LoadingPage() {
  const [css] = useStyletron();
  return (
    <Layout
      className={css({
        justifyContent: 'center',
      })}
    >
      <LoadingSpinner />
    </Layout>
  );
}
