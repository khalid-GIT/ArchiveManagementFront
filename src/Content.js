import React, {} from "react";
import TableTree from './components/TableTree.js'
import { Switch,Route } from 'react-router-dom';

function Content(){
return (
    <Switch>
      <Route  path="/TableTree" element={TableTree} />
      {/* <Route exact path="/getCities" component={Cities} />
      <Route exact path="/getTransports" component={Transports} />
      <Route exact path="/getRoles" component={Roles} />
      <Route exact path="/getUsers" component={Users} />
      <Route exact path="/getCustomers" component={Customers} />
      <Route exact path="/getTicketings" component={Ticketings} />
      <Route exact path="/getEvents" component={Events} />
      <Route exact path="/getPrograms" component={Programs} />
      <Route exact path="/getTypePrograms" component={TypePrograms} />
      <Route exact path="/getDetailPrograms" component={DetailPrograms} />
      <Route exact path="/getHotels" component={Hotels} />
      <Route exact path="/getTypeChambres" component={RoomTypes} />
      <Route exact path="/getTypeCompanys" component ={Companys}/>
      <Route exact path="/getAirPlanType" component={AirPlanTypes} />
      <Route exact path="/getPrograms" component={Programs} />
      <Route exact path="/getReservationHotels" component={ReservationHotels}/>
      <Route exact path="/getRegistrations" component={Registrations}/>
      <Route exact component={Countries} />*/}
      {/* <Route exact path="/logOut" component={Login} />  */}
      {/* <Countries /> */}
    </Switch>
  )
}
export default Content;