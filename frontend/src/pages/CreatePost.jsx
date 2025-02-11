import { useParams } from 'react-router-dom';
import FormRealisation from "../components/FormPost";

function RealisationAdd(){
  const { id } = useParams();

  return <FormRealisation route={`/realisations/${id}/posts/add`} />;
}

export default RealisationAdd;