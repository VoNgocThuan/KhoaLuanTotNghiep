import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { PUBLIC_URL } from '../../../constants';
import { Row, Form, Button } from "react-bootstrap";
import $ from 'jquery';

export default class OrderView extends Component {
    constructor() {
        super()
        this.state = {
            order: {},
            order_id: '',
            orderPrice: '',
            order_status: '',
            order_details: [],
            alert_message: '',
            shipping_city: '',
            shipping_province: '',
            shipping_wards: '',
        }
    }
    componentDidMount() {
        Axios.get(`/api/view-order/${this.props.match.params.order_code}`)
            .then(response => {
                this.setState({
                    order: response.data.order,
                    order_details: response.data.order_details,
                    order_id: response.data.order[0].id,
                    order_status: response.data.order[0].status
                });
            });
        this.getShippingAddress();
        $('.order_details').on("change", function () {
            var order_status = $(this).val();
            var order_id = $(this).children(":selected").attr("id");
            var _token = $('input[name="_token"]').val();


            //lay ra so luong
            var quantity = [];
            $("input[name='product_sales_quantity']").each(function () {
                quantity.push($(this).val());
            });
            //lay ra product id
            var order_product_id = [];
            $("input[name='order_product_id']").each(function () {
                order_product_id.push($(this).val());
            });
            $.ajax({
                url: '/api/update-order-qty',
                method: 'POST',
                data: { _token: _token, order_status: order_status, order_id: order_id, quantity: quantity, order_product_id: order_product_id },
                success: function (data) {
                    alert('Thay ?????i t??nh tr???ng ????n h??ng th??nh c??ng');
                    //location.reload();
                }
            });
        });
    }
    changeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };
    getShippingAddress = () => {
        Axios.get(`/api/view-address-from-order/${this.props.match.params.order_code}`)
            .then(response => {
                this.setState({
                    shipping_city: response.data.shipping_city,
                    shipping_province: response.data.shipping_province,
                    shipping_wards: response.data.shipping_wards,
                });
            });
    };

    render() {
        return (
            <div className="container">
                <hr />
                <h2>TH??NG TIN GIAO H??NG</h2>
                <table className="table table-hover mt-2">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">T???nh/Th??nh ph???</th>
                            <th scope="col">Qu???n/Huy???n</th>
                            <th scope="col">X??/Ph?????ng</th>
                            <th scope="col">?????a ch??? nh??</th>
                            <th scope="col">L???i nh???n</th>
                            <th scope="col">Ph????ng th???c thanh to??n</th>
                            <th scope="col">M?? gi???m gi??</th>
                            <th scope="col">Ph?? v???n chuy???n</th>
                        </tr>
                    </thead>
                    {Object.keys(this.state.order).map(
                        (item, i) => (
                            <tbody>
                                <tr key={i}>
                                    <td>
                                        {
                                            this.state.order[
                                                item
                                            ].id
                                        }
                                    </td>
                                    <td>
                                        {
                                            this.state.shipping_city
                                        }
                                    </td>
                                    <td>
                                        {
                                            this.state.shipping_province
                                        }
                                    </td>
                                    <td>
                                        {
                                            this.state.shipping_wards
                                        }
                                    </td>
                                    <td>
                                        {
                                            this.state.order[
                                                item
                                            ].address
                                        }
                                    </td>
                                    <td>
                                        {
                                            this.state.order[
                                                item
                                            ].note
                                        }
                                    </td>
                                    <td>
                                        {this.state.order[item].paymentMethod === 1 && (
                                            <>
                                                Thanh to??n tr??? tr?????c
                                            </>
                                        )}
                                        {this.state.order[item].paymentMethod === 0 && (
                                            <>
                                                Thanh to??n COD
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        {
                                            this.state.order[
                                                item
                                            ].coupon_code
                                        }
                                    </td>
                                    <td>
                                        {
                                            this.state.order[
                                                item
                                            ].feeship
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        )
                    )}
                </table>
                <h2 className="mt-5">TH??NG TIN S??CH ???????C B??N</h2>
                <table className="table table-hover mt-2">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">ID s??ch</th>
                            <th scope="col">T??n s??ch</th>
                            <th scope="col">T???ng gi?? s??ch</th>
                            <th scope="col">S??? l?????ng mua</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.order_details.map(item => {
                                return (
                                    <tr key={item.order_details_id}>
                                        <th scope="row">{item.order_details_id}</th>
                                        <td>
                                            <input type="hidden" name="order_product_id" className="order_product_id" value={item.product_id} />
                                            {item.product_id}
                                        </td>
                                        <td>{item.product_name}</td>
                                        <td>{item.product_price}</td>
                                        <td>
                                            <input type="hidden" value={item.product_sales_quantity} name="product_sales_quantity" />
                                            {item.product_sales_quantity} quy???n s??ch
                                        </td>
                                    </tr>
                                )
                            })

                        }
                    </tbody>
                </table>
                <hr />
                <Form>
                    <Row>
                        <div className="col-4">
                            <Link to={`${PUBLIC_URL}order`} className="btn btn-primary mb-5">
                                Xem danh s??ch ????n h??ng
                        </Link>
                        </div>
                        <div className="col-8">
                            <Form.Group>
                                <Form.Label><strong>T??nh tr???ng ????n h??ng</strong> <i style={{fontSize: 12 + "px"}}>(*Click ch???n t??nh tr???ng ????n h??ng ????? c???p nh???t)</i></Form.Label>
                                <Form.Control as="select"
                                    value={this.state.order_status}
                                    name="order_status"
                                    className="order_details"
                                    onChange={(e) => this.changeInput(e)}
                                >
                                    <option>----- Ch???n t??nh tr???ng -----</option>
                                    <option id={this.state.order_id} value="0">Ch??? x??c nh???n</option>
                                    <option id={this.state.order_id} value="1">Ch??? l???y h??ng</option>
                                    <option id={this.state.order_id} value="2">??ang giao</option>
                                    <option id={this.state.order_id} value="3">???? giao</option>
                                    <option id={this.state.order_id} value="4">???? h???y</option>
                                    <option id={this.state.order_id} value="5">Tr??? h??ng</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                    </Row>
                </Form>
            </div>
        );
    }

}