
import React,{useEffect,useState} from "react";
import {SafeAreaView,View,Text,TouchableOpacity,StyleSheet,ScrollView,TextInput,Alert,Image,I18nManager} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import {StatusBar} from "expo-status-bar";
import {Ionicons,MaterialCommunityIcons} from "@expo/vector-icons";

I18nManager.allowRTL(true);
const GREEN="#147A3D", DARK="#07512D", BG="#F6F7F1", GOLD="#D9A62E";
const sections=[
 ["التعريف بالمشروع","document-text-outline"],["تشجير الجانب الخارجي","tree-outline"],
 ["تشجير الجانب الداخلي","home-outline"],["تشجير ساحة المدرسة","business-outline"],
 ["مشروع 200 نخلة","palm-tree"],["التجارب الزراعية","leaf-outline"],
 ["شركة قطاف","flower-outline"],["طرق الري","water-outline"],
 ["الطاقة المتجددة","solar-power"],["الزيارات","people-outline"],
 ["المصروفات","cash-outline"],["الجهات الداعمة","handshake-outline"]
];
const seed={
 "التعريف بالمشروع":[{title:"عن المشروع",notes:"مبادرة غرس وظلال لبيئة مدرسية أجمل وأكثر خضرة."}],
 "طرق الري":[{title:"الري بالتنقيط",notes:"تسجيل النظام والموقع وحالة التشغيل."}],
 "الطاقة المتجددة":[{title:"الطاقة الشمسية",notes:"توثيق الألواح وتشغيل المضخات والإنارة."}],
 "الزيارات":[], "المصروفات":[]
};
function Icon({name,size=30,color=GREEN}) {
 const mc=["palm-tree","solar-power","handshake-outline"].includes(name);
 return mc?<MaterialCommunityIcons name={name} size={size} color={color}/>:<Ionicons name={name} size={size} color={color}/>;
}
export default function App(){
 const [screen,setScreen]=useState("splash"),[section,setSection]=useState(""),[data,setData]=useState(seed);
 const [editing,setEditing]=useState(null),[title,setTitle]=useState(""),[notes,setNotes]=useState(""),[amount,setAmount]=useState(""),[image,setImage]=useState(null);
 useEffect(()=>{AsyncStorage.getItem("ghars-data").then(v=>v&&setData(JSON.parse(v))).catch(()=>{})},[]);
 const save=async d=>{setData(d);await AsyncStorage.setItem("ghars-data",JSON.stringify(d));};
 const open=s=>{setSection(s);setScreen("list")};
 const add=()=>{setEditing(null);setTitle("");setNotes("");setAmount("");setImage(null);setScreen("edit")};
 const edit=(x,i)=>{setEditing(i);setTitle(x.title||"");setNotes(x.notes||"");setAmount(x.amount||"");setImage(x.image||null);setScreen("edit")};
 const pick=async()=>{let r=await ImagePicker.launchImageLibraryAsync({mediaTypes:["images","videos"],quality:.7});if(!r.canceled)setImage(r.assets[0].uri)};
 const commit=async()=>{if(!title.trim())return Alert.alert("تنبيه","اكتب الاسم أو العنوان");
   const arr=[...(data[section]||[])], item={title,notes,amount,image,date:new Date().toLocaleDateString("ar-OM")};
   editing===null?arr.unshift(item):arr[editing]=item; await save({...data,[section]:arr}); setScreen("list");
 };
 const del=async i=>{let a=[...(data[section]||[])];a.splice(i,1);await save({...data,[section]:a})};
 if(screen==="splash") return <SafeAreaView style={s.splash}><StatusBar style="dark"/><View style={s.logo}><Icon name="leaf-outline" size={70}/></View><Text style={s.brand}>غرس وظلال</Text><Text style={s.tag}>معًا .. لبيئة أجمل ومستقبل أكثر خضرة</Text><View style={{flex:1}}/><TouchableOpacity style={s.big} onPress={()=>setScreen("home")}><Text style={s.bigT}>ابدأ الآن</Text></TouchableOpacity></SafeAreaView>;
 if(screen==="home") return <SafeAreaView style={s.page}><StatusBar style="dark"/><View style={s.head}><Text style={s.headT}>غرس وظلال</Text><Icon name="notifications-outline" size={23}/></View><View style={s.hero}><Icon name="leaf-outline" size={42} color="white"/><Text style={s.heroT}>كل شجرة... ظل وأمل</Text></View><ScrollView contentContainerStyle={s.grid}>{sections.map(([n,ic])=><TouchableOpacity key={n} style={s.tile} onPress={()=>open(n)}><Icon name={ic}/><Text style={s.tileT}>{n}</Text></TouchableOpacity>)}</ScrollView></SafeAreaView>;
 if(screen==="edit") return <SafeAreaView style={s.page}><View style={s.head}><TouchableOpacity onPress={()=>setScreen("list")}><Icon name="arrow-forward" size={24}/></TouchableOpacity><Text style={s.headT}>{editing===null?"إضافة":"تعديل"} — {section}</Text></View><ScrollView contentContainerStyle={s.form}><Text style={s.label}>{section==="المصروفات"?"اسم المصروف":section==="الزيارات"?"عنوان الزيارة":"العنوان"}</Text><TextInput style={s.input} value={title} onChangeText={setTitle} placeholder="اكتب هنا..." textAlign="right"/>{section==="المصروفات"&&<><Text style={s.label}>المبلغ (ر.ع)</Text><TextInput style={s.input} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" textAlign="right"/></>}<Text style={s.label}>الملاحظات</Text><TextInput style={[s.input,{height:120}]} multiline value={notes} onChangeText={setNotes} textAlign="right"/><TouchableOpacity style={s.media} onPress={pick}><Icon name="images-outline"/><Text>إضافة صورة أو فيديو</Text></TouchableOpacity>{image&&<Image source={{uri:image}} style={s.preview}/>}<TouchableOpacity style={s.big} onPress={commit}><Text style={s.bigT}>حفظ</Text></TouchableOpacity></ScrollView></SafeAreaView>;
 const arr=data[section]||[];
 return <SafeAreaView style={s.page}><View style={s.head}><TouchableOpacity onPress={()=>setScreen("home")}><Icon name="arrow-forward" size={24}/></TouchableOpacity><Text style={s.headT}>{section}</Text><TouchableOpacity onPress={add}><Icon name="add-circle" size={29}/></TouchableOpacity></View><ScrollView contentContainerStyle={{padding:14,paddingBottom:90}}>{arr.length===0&&<View style={s.empty}><Icon name="leaf-outline" size={45}/><Text style={s.muted}>لا توجد بيانات بعد</Text></View>}{arr.map((x,i)=><View style={s.card} key={i}>{x.image&&<Image source={{uri:x.image}} style={s.thumb}/>}<View style={{flex:1}}><Text style={s.cardT}>{x.title}</Text>{x.amount?<Text style={s.money}>{x.amount} ر.ع</Text>:null}<Text style={s.muted}>{x.date||""}</Text><Text style={s.notes}>{x.notes}</Text><View style={s.actions}><TouchableOpacity onPress={()=>edit(x,i)}><Icon name="create-outline" size={22}/></TouchableOpacity><TouchableOpacity onPress={()=>Alert.alert("حذف","هل تريد حذف هذا السجل؟",[{text:"إلغاء"},{text:"حذف",onPress:()=>del(i)}])}><Icon name="trash-outline" size={22} color="#A33"/></TouchableOpacity></View></View></View>)}</ScrollView><TouchableOpacity style={s.fab} onPress={add}><Icon name="add" size={25} color="white"/><Text style={s.bigT}>{section==="الزيارات"?"إضافة زيارة جديدة":section==="المصروفات"?"إضافة مصروف جديد":"إضافة جديد"}</Text></TouchableOpacity></SafeAreaView>
}
const s=StyleSheet.create({
 page:{flex:1,backgroundColor:BG},splash:{flex:1,backgroundColor:"#FBFCF7",alignItems:"center",padding:28},
 logo:{marginTop:90,width:130,height:130,borderRadius:65,backgroundColor:"#EDF4E6",alignItems:"center",justifyContent:"center"},
 brand:{fontSize:38,fontWeight:"800",color:DARK,marginTop:15},tag:{fontSize:16,color:"#536657",marginTop:8},
 head:{height:62,paddingHorizontal:16,flexDirection:"row-reverse",alignItems:"center",justifyContent:"space-between",backgroundColor:"#fff"},
 headT:{fontSize:20,fontWeight:"800",color:"#19372A"},hero:{margin:14,borderRadius:18,padding:18,minHeight:110,backgroundColor:DARK,justifyContent:"center",alignItems:"flex-end"},heroT:{color:"white",fontWeight:"800",fontSize:20,marginTop:8},
 grid:{padding:10,flexDirection:"row-reverse",flexWrap:"wrap",justifyContent:"space-between",paddingBottom:30},tile:{width:"48%",height:105,backgroundColor:"white",borderRadius:15,marginBottom:10,alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:"#E1E6DC"},tileT:{marginTop:8,fontWeight:"700",color:"#254334"},
 card:{backgroundColor:"white",borderRadius:15,padding:12,marginBottom:10,flexDirection:"row-reverse",gap:12,borderWidth:1,borderColor:"#E4E7DF"},thumb:{width:92,height:92,borderRadius:10},cardT:{fontWeight:"800",fontSize:17,color:"#243C31"},money:{fontSize:19,fontWeight:"800",color:GREEN,marginVertical:4},muted:{color:"#819087",marginTop:4},notes:{color:"#44564D",marginTop:5},actions:{flexDirection:"row-reverse",gap:18,marginTop:10},
 fab:{position:"absolute",bottom:18,left:18,right:18,height:52,borderRadius:12,backgroundColor:GREEN,flexDirection:"row",gap:8,alignItems:"center",justifyContent:"center"},big:{height:54,borderRadius:14,backgroundColor:GREEN,alignItems:"center",justifyContent:"center",width:"100%",marginBottom:20},bigT:{color:"white",fontWeight:"800",fontSize:16},
 form:{padding:18,gap:8},label:{fontWeight:"800",fontSize:16,color:"#294235",marginTop:8},input:{backgroundColor:"white",borderWidth:1,borderColor:"#DDE3DA",borderRadius:12,padding:13,fontSize:16},media:{backgroundColor:"#EAF3EB",padding:16,borderRadius:12,alignItems:"center",gap:5},preview:{height:190,width:"100%",borderRadius:12},empty:{alignItems:"center",paddingTop:90,gap:10}
});
