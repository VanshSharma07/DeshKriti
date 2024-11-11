import { useSelector } from 'react-redux';

const SellerNameDisplay = ({ sellerId }) => {
  const sellers = useSelector(state => state.seller.sellers); // Liste des vendeurs
  const seller = sellers?.find(seller => seller._id === sellerId); // Trouver le vendeur par ID

  return (
    <div>
      {seller ? (
        <p>Seller: {seller.name}</p>
      ) : (
        <p>Seller not found</p>
      )}
    </div>
  );
};

export default SellerNameDisplay;