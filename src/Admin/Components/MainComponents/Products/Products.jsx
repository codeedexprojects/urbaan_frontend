import React, { useState } from 'react'
import Filter from './Filter'
import ListView from './ListView'
import GridView from './GridView'
import { useEffect } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../../../StoreContext/StoreContext'
import axios from 'axios'
import { Button } from '@material-tailwind/react'
import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa6'
import toast from 'react-hot-toast'


const Products = () => {
  const [view, setView] = useState('list')
  const { BASE_URL, handleOpen } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialProducts, setInitialProducts] = useState(null)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState([]);

  // fetch products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Authorization is missing")
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await axios.get(`${BASE_URL}/admin/products/view-products`, { headers });
      setProducts(response.data);
      setIsLoading(false)
      console.log(response.data);
    } catch (error) {
      console.log(error, ": error fetching products");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [])

  // handle delete product
  const handleDeleteProduct = async (productId) => {
    console.log(productId);
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert("Authorization is missing")
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.delete(`${BASE_URL}/admin/products/delete-product/${productId}`, { headers })
      console.log(response.data);
      handleOpen()
      toast.success("Product is deleted")
      setProducts(products.filter(product => product.id !== productId));
      fetchProducts()
    } catch (error) {
      console.log(error);
      alert("Product is not deleted")
      handleOpen()
    }
  }


  return (
    <>
      <h1 className='text-2xl lg:text-3xl font-semibold'>Products</h1>
      <div className="grid grid-cols-8 mt-5 gap-5">
        <div className='grid col-span-2 overflow-y-auto hide-scrollbar'>
          <Filter
            view={view}
            setView={setView}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            setProducts={setProducts} />
        </div>
        <div className='grid col-span-6 overflow-y-auto hide-scrollbar space-y-5'>
          <Link
            to='/adminHome/addProduct'
          >
            <Button className='flex items-center gap-1 bg-buttonBg font-custom font-normal text-sm'><FaPlus />Add product</Button>
          </Link>
          {view === "list" ? (
            <ListView
              products={products}
              isLoading={isLoading}
              // initialProducts={initialProducts}
              // setInitialProducts={setInitialProducts}
              selectedProductId={selectedProductId}
              setSelectedProductId={setSelectedProductId}
              handleDeleteProduct={handleDeleteProduct}
            />
          ) : (
            <GridView
              products={products}
              isLoading={isLoading}
              // initialProducts={initialProducts}
              // setInitialProducts={setInitialProducts}
              selectedProductId={selectedProductId}
              setSelectedProductId={setSelectedProductId}
              handleDeleteProduct={handleDeleteProduct}
            />
          )
          }
        </div>
      </div>
    </>
  )
}

export default Products
