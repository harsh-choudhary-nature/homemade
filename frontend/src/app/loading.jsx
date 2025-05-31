// app/loading.jsx
import Loader from '@/components/Loader';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Loader />
    </div>
  );
}
