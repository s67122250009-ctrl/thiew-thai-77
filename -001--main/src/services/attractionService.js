import { get, ref } from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import bilingualData from "../data/master-data.bilingual.json";

const provinceNames = [["กรุงเทพมหานคร","Bangkok"],["กระบี่","Krabi"],["กาญจนบุรี","Kanchanaburi"],["กาฬสินธุ์","Kalasin"],["กำแพงเพชร","Kamphaeng Phet"],["ขอนแก่น","Khon Kaen"],["จันทบุรี","Chanthaburi"],["ฉะเชิงเทรา","Chachoengsao"],["ชลบุรี","Chonburi"],["ชัยนาท","Chai Nat"],["ชัยภูมิ","Chaiyaphum"],["ชุมพร","Chumphon"],["เชียงราย","Chiang Rai"],["เชียงใหม่","Chiang Mai"],["ตรัง","Trang"],["ตราด","Trat"],["ตาก","Tak"],["นครนายก","Nakhon Nayok"],["นครปฐม","Nakhon Pathom"],["นครพนม","Nakhon Phanom"],["นครราชสีมา","Nakhon Ratchasima"],["นครศรีธรรมราช","Nakhon Si Thammarat"],["นครสวรรค์","Nakhon Sawan"],["นนทบุรี","Nonthaburi"],["นราธิวาส","Narathiwat"],["น่าน","Nan"],["บึงกาฬ","Bueng Kan"],["บุรีรัมย์","Buri Ram"],["ปทุมธานี","Pathum Thani"],["ประจวบคีรีขันธ์","Prachuap Khiri Khan"],["ปราจีนบุรี","Prachin Buri"],["ปัตตานี","Pattani"],["พะเยา","Phayao"],["พังงา","Phang Nga"],["พัทลุง","Phatthalung"],["พิจิตร","Phichit"],["พิษณุโลก","Phitsanulok"],["เพชรบุรี","Phetchaburi"],["เพชรบูรณ์","Phetchabun"],["แพร่","Phrae"],["ภูเก็ต","Phuket"],["มหาสารคาม","Maha Sarakham"],["มุกดาหาร","Mukdahan"],["แม่ฮ่องสอน","Mae Hong Son"],["ยโสธร","Yasothon"],["ยะลา","Yala"],["ร้อยเอ็ด","Roi Et"],["ระนอง","Ranong"],["ระยอง","Rayong"],["ราชบุรี","Ratchaburi"],["ลพบุรี","Lopburi"],["ลำปาง","Lampang"],["ลำพูน","Lamphun"],["เลย","Loei"],["ศรีสะเกษ","Si Sa Ket"],["สกลนคร","Sakon Nakhon"],["สงขลา","Songkhla"],["สตูล","Satun"],["สมุทรปราการ","Samut Prakan"],["สมุทรสงคราม","Samut Songkhram"],["สมุทรสาคร","Samut Sakhon"],["สระแก้ว","Sa Kaeo"],["สระบุรี","Saraburi"],["สิงห์บุรี","Sing Buri"],["สุพรรณบุรี","Suphan Buri"],["สุราษฎร์ธานี","Surat Thani"],["สุรินทร์","Surin"],["สุโขทัย","Sukhothai"],["หนองคาย","Nong Khai"],["หนองบัวลำภู","Nong Bua Lamphu"],["อ่างทอง","Ang Thong"],["อำนาจเจริญ","Amnat Charoen"],["อุดรธานี","Udon Thani"],["อุตรดิตถ์","Uttaradit"],["อุทัยธานี","Uthai Thani"],["อุบลราชธานี","Ubon Ratchathani"]];
export const provinces = provinceNames.map(([name_th,name_en], i) => ({province_id:`province_${String(i+1).padStart(3,"0")}`,name_th,name_en}));
export const categories = [{category_id:"category_nature",name_th:"ธรรมชาติ",name_en:"Nature"},{category_id:"category_culture",name_th:"วัฒนธรรมและประวัติศาสตร์",name_en:"Culture & history"},{category_id:"category_general",name_th:"แหล่งท่องเที่ยว",name_en:"Attractions"}];
const byProvince=Object.fromEntries(provinces.map(p=>[p.name_th,p]));
const categorize=x=>/วัด|พิพิธภัณฑ์|เมืองเก่า|โบราณ|พระธาตุ|มัสยิด|ศาล|อุโมงค์/.test(x.name_th)?"category_culture":/อุทยาน|ดอย|ภู|น้ำตก|หาด|ทะเล|เกาะ|ถ้ำ|คลอง|เขา|กว๊าน|ปางอุ๋ง/.test(x.name_th)?"category_nature":"category_general";
function normalize(item,index=0){const province=byProvince[item.province]||provinces.find(p=>p.province_id===item.province_id)||provinces[0],name=item.name_en||`Thai attraction ${String(item.attraction_id).padStart(3,"0")}`;return {...item,attraction_id:String(item.attraction_id),province_id:item.province_id||province.province_id,category_id:item.category_id||categorize(item),name_th:item.name_th||item.name||"ไม่ระบุชื่อสถานที่",name_en:name,description_th:item.description_th||item.description||"ยังไม่มีรายละเอียด",description_en:item.description_en||`${name} is a tourist destination in ${province.name_en}, Thailand.`,history_th:item.history_th||item.history||"ยังไม่มีข้อมูลประวัติ",history_en:item.history_en||`${name} is included in the Thiew Thai 77 attraction collection.`,is_featured:item.is_featured??index<6,image_thumbnail:item.image_thumbnail||null,image_detail:item.image_detail||null};}
const fallbackAttractions = bilingualData.data.map(normalize);let cached=null;
const bilingualMap = new Map(
  fallbackAttractions.map((item) => [
    String(item.attraction_id),
    item
  ])
);
async function firebaseAttractions(){if(!db)return null;const snapshot=await get(ref(db,"attractions"));if(!snapshot.exists())return null;const value=snapshot.val();return (Array.isArray(value)?value:Object.values(value)).map(normalize);}
export async function getAttractions() {
  if (cached) return cached;

  try {
    const firebaseData = await firebaseAttractions();

    if (!firebaseData || firebaseData.length === 0) {
      cached = fallbackAttractions;
      return cached;
    }

    cached = firebaseData.map((firebaseItem) => {
      const bilingualItem = bilingualMap.get(
        String(firebaseItem.attraction_id)
      );

      if (!bilingualItem) {
        return firebaseItem;
      }

      return {
        ...bilingualItem,
        ...firebaseItem,

        name_th:
          firebaseItem.name_th ||
          bilingualItem.name_th,

        name_en:
          firebaseItem.name_en ||
          bilingualItem.name_en,

        description_th:
          firebaseItem.description_th ||
          bilingualItem.description_th,

        description_en:
          firebaseItem.description_en ||
          bilingualItem.description_en,

        history_th:
          firebaseItem.history_th ||
          bilingualItem.history_th,

        history_en:
          firebaseItem.history_en ||
          bilingualItem.history_en,
      };
    });

    return cached;

  } catch (error) {
    console.warn(
      "Firebase unavailable; using bilingual JSON fallback.",
      error
    );

    cached = fallbackAttractions;

    return cached;
  }
}
export async function getAttractionById(id){return (await getAttractions()).find(x=>x.attraction_id===String(id))||null}
export async function getProvinces(){return provinces} export async function getCategories(){return categories}
export async function searchAttractions(query="",filters={}){const keyword=query.trim().toLocaleLowerCase();return (await getAttractions()).filter(x=>{const text=[x.name_th,x.name_en,x.description_th,x.description_en,byProvince[x.province]?.name_th].filter(Boolean);return (!keyword||text.some(v=>v.toLocaleLowerCase().includes(keyword)))&&(!filters.province_id||x.province_id===filters.province_id)&&(!filters.category_id||x.category_id===filters.category_id)})}
export function getProvince(item){return provinces.find(x=>x.province_id===item.province_id)||byProvince[item.province]} export function getCategory(item){return categories.find(x=>x.category_id===item.category_id)}
