import "./App.css";
import UserHome from "./components/userHome";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BmiView from "./components/user management/BmiView";
import Profile from "./components/user management/profile";
import AddClasses from "./components/schedules/AddClasses";
import Edit from "./components/schedules/Edit";
import Home from "./components/Home";
import Login from "./components/user management/Login"; // Import  component
import Register from "./components/user management/Register";
import Package from "./components/packages/Package";
import PackageView from "./components/packages/PackageView";
import Packageuserview from "./components/packages/Packageuserview";
import AboutUs from "./components/AboutUs";
import Productview from "./components/products/Productview";
import Paymentview from "./components/payments/Paymentview";
import Adminhome from "./components/Adminhome";
import Packageedit from "./components/packages/Packageedit";
import Addtrainer from "./components/trainers/Addtrainer2";
import Traineredit from "./components/trainers/Traineredit2";
import Trainerview from "./components/trainers/Trainerview2";
import Traineruserview from "./components/schedules/Traineruserview";
import Payment from "./components/payments/Payment";
import Productadminview from "./components/products/Productadminview";
import Addproduct from "./components/products/Addproduct";
import Productedit from "./components/products/Productedit";
import Profileedit from "./components/user management/Profileedit";
import Traineraddview from "./components/trainers/Trainer-view";
import TrainerRegister from "./components/trainers/TrainerRegister";
import SalaryView from "./components/salaries/Salary-view";
import Addsalary from "./components/salaries/addsalary";
import Editsalary from "./components/salaries/editsalary";
import Proview from "./components/products/pro-view";
import Packview from "./components/packages/pack-view";
import Userview from "./components/user management/user-view";
import Edittrainer from "./components/trainers/Edit-trainer";
import Paymentcard from "./components/payments/Add-card-payment";
import Paymentcardview from "./components/payments/Payment-view";
import Paymentedit from "./components/payments/Edit-payment";
import Packpay from "./components/payments/showpackpament";
import AddPack from "./components/payments/Add-pack";
import EditPack from "./components/payments/Edit-pack";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pro-view" element={<Proview />} />
        <Route path="/edit-page" element={<EditPack />} />
        <Route path="/add-page" element={<AddPack />} />
        <Route path="/pro-view" element={<Proview />} />
        <Route path="/payment-card" element={<Paymentcard />} />
        <Route path="/product-payment-view" element={<Packpay />} />
        <Route path="/payment-card-view" element={<Paymentcardview />} />
        <Route path="/payment-edit" element={<Paymentedit />} />
        <Route path="/edit-trainer" element={<Edittrainer />} />
        <Route path="/user-view" element={<Userview />} />
        <Route path="/pack-view" element={<Packview />} />
        <Route path="/edit-profile/" element={<Profileedit />} />
        <Route path="/edit-product/" element={<Productedit />} />
        <Route path="/product" element={<Addproduct />} />
        <Route path="/salary-add" element={<Addsalary />} />
        <Route path="/edit-salary" element={<Editsalary />} />
        <Route path="/salary-view" element={<SalaryView />} />
        <Route path="/trainer-add-view" element={<Traineraddview />} />
        <Route path="/trainer-register" element={<TrainerRegister />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/product-admin-view" element={<Productadminview />} />
        <Route path="/edit-trainer/:id" element={<Traineredit />} />
        <Route path="/trainer" element={<Addtrainer />} />
        <Route path="/trainer-view" element={<Trainerview />} />
        <Route path="/trainer-user-view" element={<Traineruserview />} />
        <Route path="/edit-package/:id" element={<Packageedit />} />
        <Route path="/package" element={<Package />} />
        <Route path="/admin-home" element={<Adminhome />} />
        <Route path="/Payment-view" element={<Paymentview />} />
        <Route path="/product-view" element={<Productview />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/package-view" element={<PackageView />} />
        <Route path="/package-user-view" element={<Packageuserview />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-classes" element={<AddClasses />} />
        
        <Route path="//bmi-tracker" element={<BmiView />} />
        <Route path="/edit/" element={<Edit />} />
        <Route path="/login" element={<Login />} /> {/* Route for login */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
