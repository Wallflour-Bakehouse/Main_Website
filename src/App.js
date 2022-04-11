import React, { useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Nav from './components/nav/nav';
import Footer from './components/footer/footer';
import DialogBox from './components/modal/modal';
import Home from './components/home/home';
import Contact from './components/contactus/contactus';
import Menu from './components/menu/menu';
import Cart from './components/cart/cart';
import ProductDetail from './components/product_detail/product_detail';
import Checkout from './components/checkout/checkout';
import Login from './components/login/login';
import SignUp from './components/login/signup';
import Preference from './components/login/preference';
import UserAccountNav from './components/user/dashboard_nav/user_account_nav';
import UserComments from './components/user/recent_comments/user_comment';
import Account from './components/user/account/account';
// import Coupons from './components/user/coupons/coupons';
import Favourite from './components/user/favourite/favourite';
import UserOrders from'./components/user/order_list/order';
import UserAddress from './components/user/user_address/user_address';
import UserChat from './components/user/user_chat/user_chat';
import UserOrderDetail from './components/user/order_detail/order_detail';
import Error from './components/error/error';


function App() {
  const [modal, setModal] = useState({open: false, header: "", body: ""})
  function closeModal(){
    setModal({open: !modal.open})
  }
  function triggerModal(header, body){
    setModal({
      open: !modal.open,
      header: header,
      body: body  
    })
  }
  return (
    <BrowserRouter>
        <Nav/> 
        <DialogBox modal={modal} closeModal={closeModal} />
        <Switch>
            <Route exact path="/home" component={()=><Home />} />
            <Route exact path="/menu"  component={()=><Menu />} />
            <Route exact path="/menu/:prodName"  component={()=><ProductDetail />} />
            <Route exact path="/contact" component={()=><Contact />} />
            <Route exact path="/cart"  component={()=><Cart triggerModal={triggerModal} />} />
            <Route exact path="/checkout"  component={()=><Checkout />} />
            <Route exact path="/login"  component={()=><Login />} />
            <Route exact path="/signup"  component={()=><SignUp />} />
            <Route exact path="/signup/preference"  component={()=><Preference />} />
            <Route exact path="/user/dashboard"  component={()=><UserAccountNav />} />
            <Route exact path="/user/account"  component={()=><Account triggerModal={triggerModal} />} />
            <Route exact path="/user/address"  component={()=><UserAddress />} />
            <Route exact path="/user/comments"  component={()=><UserComments />} />
            {/* <Route exact path="/user/coupons"  component={()=><Coupons />} /> */}
            <Route exact path="/user/chat"  component={()=><UserChat />} />
            <Route exact path="/user/orders"  component={()=><UserOrders />} />
            <Route exact path="/user/orders/:orderId"  component={()=><UserOrderDetail triggerModal={triggerModal} />} />
            <Route exact path="/user/favourites"  component={()=><Favourite />} />
            <Route exact path="/error" component={()=><Error />} />
            <Redirect to="/error" />
        </Switch>
        <Footer/>
    </BrowserRouter>
  );
}

export default App;
