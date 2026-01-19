import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-[#fcfaf7] dark:bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-display font-bold text-gold-500 mb-4">403</h1>
      <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">
        Accès Non Autorisé
      </h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8">
        Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button variant="outline">Retour à l'accueil</Button>
        </Link>
        <Link to="/login">
          <Button variant="primary">Se connecter avec un autre compte</Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
