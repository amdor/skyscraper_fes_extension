const SPINNER = `<i class="fa fa-spinner fa-spin fa-2x fa-fw" style="float: right; margin-top: 15px;"></i>`;
const GET_VALUE_BUTTON = $(`<div style="float: right; margin-top: 8px;">
                                <i class="fa fa-magic fa-2x" style="background-color: orange;
                                border-radius: 18px; border: 7px; border-color: orange; border-style: solid; cursor: pointer;" aria-hidden="true">
                                </i>
                            </div>`);
const COMPARE_BUTTON = $(`<li class="inaktiv">
                            <a rel="nofollow" target="_blank"
                                href="http://localhost:3000"
                                id="compareButton">
                                <strong>Összehasonlítás(<span class="compare-number">0</span>)</strong>
                            </a>
                        </li>`);
const ADD_FOR_COMPARE_BUTTON = $(`<input type="button" style="float: right; margin-top: 15px; margin-right: 5px;
                                    background-color: #f0f0f0;
                                    border: 1px solid #e6e6e6;
                                    padding: 3px 10px;
                                    font-size: 12px;
                                    color: #0464a4;
                                    cursor: pointer;" value="Összehasonlít">`);
