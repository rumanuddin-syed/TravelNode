import React from 'react';
import { useParams } from 'react-router-dom';
import BASE_URL from '../../utils/config';
import useFetch from '../../hooks/useFetch';
import UpdateToursComp from './UpdateTourComp';

const UpdateTours = () => {
  const { id } = useParams();
  const { apiData: tour, error } = useFetch(`${BASE_URL}/tour/${id}`);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <UpdateToursComp tour={tour} id={id} />
    </div>
  );
};

export default UpdateTours;