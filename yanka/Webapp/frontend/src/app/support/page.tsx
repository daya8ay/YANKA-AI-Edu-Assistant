import NavBar from '@/components/NavBar';
import SupportContent from './SupportContent';
import styles from './support.module.css';

export const metadata = {
  title: 'Customer Support - YANKA',
  description: 'Get help and support for your account',
};

export default function SupportPage() {
  return (
    <>
      <NavBar />
      <div className={styles.supportContainer}>
        <SupportContent />
      </div>
    </>
  );
}
