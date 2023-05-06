import axios from "axios";
import { API_URL } from '../../layout/AppConfig';

export const FournisseurService = {

    getFournisseurList() {
        return axios.get(API_URL + 'fournisseur/');
    },
    saveFournisseur(fournisseur){
        return axios.post(API_URL + 'fournisseur/',fournisseur)

    },

    putFournisseur(fournisseur){
        return axios.put(API_URL + 'fournisseur/',fournisseur)

    },
    deleteFournisseur(id){
        return axios.delete(API_URL + 'fournisseur/id/' + id)
    }
}
