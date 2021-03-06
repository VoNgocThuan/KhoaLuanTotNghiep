import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import SuccessAlert from '../../layouts/SuccessAlert';
import ErrorAlert from '../../layouts/ErrorAlert';
import { PUBLIC_URL } from '../../../constants';
export default class Listing extends Component {
    
    constructor()
    {
        super()
        this.state={
            coupons:[],
            activePage: 1,
            itemsCountPerPage: 1,
            totalItemsCount: 1,
            alert_message: ''
        }
        this.handlePageChange = this.handlePageChange.bind(this);
    }
    componentDidMount()
    {
        Axios.get('http://localhost:8000/api/coupons')
        .then(response=>{
            this.setState({
                coupons: response.data.data,
                //Trong Postman
                itemsCountPerPage: response.data.per_page,
                totalItemsCount: response.data.total,
                activePage: response.data.current_page
            });
        });
    }
    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        //this.setState({activePage: pageNumber});
        Axios.get('http://localhost:8000/api/coupons?page=' + pageNumber)
            .then(response => {
                this.setState({
                    coupons: response.data.data,
                    //Trong Postman
                    itemsCountPerPage: response.data.per_page,
                    totalItemsCount: response.data.total,
                    activePage: response.data.current_page
                });
            });
    }
    onDelete(coupon_id) {
        Axios.delete('http://localhost:8000/api/coupons/' + coupon_id)
        .then(response => {
            var coupons = this.state.coupons;
            for (var i = 0; i < coupons.length; i++) {
                if (coupons[i].coupon_id == coupon_id) {
                    coupons.splice(i, 1);
                    this.setState({ coupons: coupons });
                }
            }
            this.setState({ alert_message: "success" })
        }).catch(error => {
            this.setState({ alert_message: "error" });
        })

    }
    render()
    {
        return (
            <div>
                <hr />
                <h2>DANH S??CH M?? GI???M GI??</h2>
            {this.state.alert_message == "success" ? <SuccessAlert message={"X??a th??nh c??ng m?? gi???m gi??!"} /> : null}
            {this.state.alert_message == "error" ? <ErrorAlert message={"L???i x???y ra trong l??c x??a!"} /> : null}

                <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">T??n m?? gi???m gi??</th>
                        <th scope="col">M?? gi???m gi??</th>
                        <th scope="col">S??? l???n s??? d???ng</th>
                        <th scope="col">T??nh n??ng m?? gi???m gi??</th>
                        <th scope="col">S??? ph???n tr??m / S??? ti???n gi???m</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.coupons.map(coupon =>{
                                return (
                                    <tr key={coupon.coupon_id}>
                                        <th scope="row">{coupon.coupon_id}</th>
                                        <td>{coupon.coupon_name}</td>
                                        <td>{coupon.coupon_code}</td>
                                        <td>{coupon.coupon_time}</td>
                                        <td>{coupon.coupon_condition==1?("Gi???m theo ph???n tr??m"):("Gi???m theo s??? ti???n")}</td>
                                        <td>
                                            {coupon.coupon_condition==1 && 
                                                (
                                                    <>
                                                        Gi???m {coupon.coupon_number}%
                                                    </>
                                                )
                                            }
                                            {coupon.coupon_condition==0 && 
                                                (
                                                    <>
                                                        Gi???m {coupon.coupon_number}??
                                                    </>
                                                )
                                            }
                                        </td>
                                        <td>
                                            <Link to={`${PUBLIC_URL}coupon/create`} className="btn btn-outline-info mr-2">Th??m</Link>
                                            <Link to={`${PUBLIC_URL}coupon/update/${coupon.coupon_id}`} className="btn btn-outline-primary mr-2">S???a</Link>
                                            <a href="#" onClick={this.onDelete.bind(this, coupon.coupon_id)} className="btn btn-outline-danger">X??a</a>
                                        </td>
                                    </tr>
                                )
                            })
                        
                        }       
                    </tbody>
                </table>
                <div className="d-flex justify-content-center">
                    <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.itemsCountPerPage}
                        totalItemsCount={this.state.totalItemsCount}
                        pageRangeDisplayed={this.state.pageRangeDisplayed}
                        onChange={this.handlePageChange}
                        itemClass='page-item'
                        linkClass='page-link'
                    />
                </div>
            </div>
        );
    }
    
}



