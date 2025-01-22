import { Spinner } from "react-bootstrap";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center text-center min-h-screen font-bold text-indigo-500 dark:bg-neutral-900">
      <Spinner animation="border" role="status"
        style={{ width: '10rem', height: '10rem' }}
      />
    </div>
  );
}

export default Loading;