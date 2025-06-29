
import { Link } from 'react-router-dom';
import { Card } from './ui/card';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    image: string;
  };
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/products?category=${category.id}`}>
      <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="aspect-square overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
            {category.name}
          </h3>
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;
