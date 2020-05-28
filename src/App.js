import React from 'react';
// import logo from "./logo.svg";
import {v4 as uuidv4} from 'uuid';
import './App.css';
import Modal from './components/Modal';
import ExportPDF from 'react-to-pdf';
import {translate} from 'react-i18next';

const prefix = process.env.REACT_APP_MODE === 'prod' ? '/silsilah' : '/';

// Basic structure
const tree = [
  {
    id: '00000000-0000-0000-0000-00000000000',
    type: 'root',
  },
  {
    id: 'd066198b-d26e-4408-b71f-651e6e75d011',
    parents: ['00000000-0000-0000-0000-00000000000'],
    type: 'node',
    name: 'Father',
    status: 'alive',
    gender: 'male',
    spouse: '6e66875d-4b6c-4670-bfbe-876e8ced64b1',
    fullName: 'Father',
    birthPlace: 'Jakarta Pusat',
    birthDate: '19600101',
    city: 'Jakarta',
    contact: '+6281234567890',
  },
  {
    id: '6e66875d-4b6c-4670-bfbe-876e8ced64b1',
    type: 'node',
    status: 'deceased',
    gender: 'female',
    name: 'Mother',
    fullName: 'Mother',
    birthPlace: 'Jakarta Selatan',
    birthDate: '19700101',
    city: 'Jakarta',
    contact: '+6281234567891',
  },
  {
    id: '8a6d88a0-285d-4aed-a710-cfbd5f8dc5f6',
    parents: [
      'd066198b-d26e-4408-b71f-651e6e75d011',
      '6e66875d-4b6c-4670-bfbe-876e8ced64b1',
    ],
    status: 'alive',
    type: 'node',
    gender: 'male',
    name: 'Son',
    fullName: 'Son',
    birthPlace: 'Jakarta Barat',
    birthDate: '19900101',
    city: 'Jakarta',
    contact: '+6281234567892',
  },
  {
    id: '14081329-ee06-4f53-8689-c9f716c5e3a2',
    parents: [
      'd066198b-d26e-4408-b71f-651e6e75d011',
      '6e66875d-4b6c-4670-bfbe-876e8ced64b1',
    ],
    status: 'alive',
    type: 'node',
    gender: 'female',
    name: 'Daughter',
    fullName: 'Daughter',
    birthPlace: 'Jakarta Timur',
    birthDate: '19900102',
    city: 'Jakarta',
    contact: '+6281234567893',
  },
];

class NodeLegacy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: 'Ford',
    };
  }
  componentDidMount() {
    let nodes = this.props.tree.filter(data => {
      let childs = [];
      for (let i in this.props.tree) {
        if (
          this.props.tree[i].parents &&
          this.props.tree[i].parents.includes(data.id) &&
          this.props.tree[i].parents.includes(data.spouse)
        ) {
          childs.push(this.props.tree[i]);
          data.hasChildren = true;
        }
      }
      data.childs = childs;
      if (
        data.parents &&
        data.parents.includes(this.props.parents[0]) &&
        (this.props.root || data.parents.includes(this.props.parents[1]))
      ) {
        return true;
      } else {
        return false;
      }
    });
    for (let i in nodes) {
      let node = nodes[i];
      // divorced but not remarried
      if (node.exs && node.exs.length === 1 && !node.spouse) {
        nodes[i].spouse = node.exs[0].id;
        nodes[i].divorced = true;
      }
      // divorced but has been remarried
      if (!node.divorced && node.spouse && node.exs && node.exs.length > 0) {
        node.divorcedRemarried = true;
        for (let j in node.exs) {
          let ex = node.exs[j];
          for (let k in this.props.tree) {
            if (
              node.spouse &&
              this.props.tree[k].parents &&
              this.props.tree[k].parents.includes(node.id) &&
              this.props.tree[k].parents.includes(ex.id)
            ) {
              nodes[i].hasChildrenFromExs = true;
            }
          }
        }
      }
    }
    this.setState({nodes: nodes}, () => {
      // Do nothing
    });
  }
  render() {
    const {t, i18n} = this.props;
    return (
      <div>
        {this.state.nodes &&
          this.state.nodes.map((node, key) => {
            return (
              <div
                id={this.props.root ? 'root-family' : ''}
                className="family"
                key={key}>
                {this.state.nodes.length > 1 &&
                  node.exs &&
                  node.exs.length > 0 && (
                    <div className={'sibling-line-right-with-exs'}></div>
                  )}
                {node.divorcedRemarried &&
                  node.exs &&
                  node.exs.length > 0 &&
                  node.exs.map((ex, k) => {
                    return (
                      <div style={{display: 'inline-block'}} key={k}>
                        {this.props.tree
                          .filter(data => {
                            return data.id === ex.id;
                          })
                          .map((n, ek) => {
                            return (
                              <div className="family" key={ek}>
                                <div
                                  className={
                                    'node' +
                                    (n.parents && node.parents.length > 0
                                      ? ' node-gen'
                                      : '') +
                                    (n.status === 'deceased'
                                      ? ' node-deceased'
                                      : '')
                                  }
                                  id={n.id}>
                                  {n.name}
                                  {n.img && (
                                    <img width="100" src={n.img} alt="" />
                                  )}
                                </div>
                                {key === this.state.nodes.length - 1 &&
                                  this.state.nodes.length > 1 &&
                                  node.exs &&
                                  node.exs.length > 0 && (
                                    <div className={'marital-line-exs'}></div>
                                  )}
                                {node.hasChildrenFromExs && (
                                  <div className="derivative-line-ex"></div>
                                )}
                                <Node
                                  tree={this.props.tree}
                                  parents={[node.id, n.id]}
                                  showModal={this.props.showModal}
                                />
                              </div>
                            );
                          })}
                      </div>
                    );
                  })}
                <div
                  id={this.props.root ? 'root-family-sub' : ''}
                  className="family">
                  {key === 0 && this.state.nodes.length > 1 && (
                    <div className={'sibling-line-left'}></div>
                  )}
                  {key === this.state.nodes.length - 1 &&
                    this.state.nodes.length > 1 && (
                      <div
                        className={
                          'sibling-line-right' +
                          (node.spouse ? ' sibling-line-right-with-spouse' : '')
                        }></div>
                    )}
                  {!(key === 0 || key === this.state.nodes.length - 1) &&
                    this.state.nodes.length > 1 && (
                      <div className={'sibling-line-center'}></div>
                    )}
                  <div
                    className={
                      'node' +
                      (node.parents && node.parents.length > 0
                        ? ' node-gen'
                        : '') +
                      (node.status === 'deceased' ? ' node-deceased' : '')
                    }
                    id={node.id}
                    onClick={() => {
                      node.mode = 'edit';
                      node.scene = 'form';
                      this.props.showModal(node);
                    }}>
                    {!this.props.root && (
                      <div className="derivative-line-2"></div>
                    )}
                    {key === 0 &&
                      this.state.nodes.length > 1 &&
                      node.spouse && (
                        <div className="sibling-line-left-node"></div>
                      )}
                    {key === this.state.nodes.length - 1 &&
                      this.state.nodes.length > 1 &&
                      node.spouse && (
                        <div className={'sibling-line-right-node'}></div>
                      )}
                    {node.name}
                    {node.img && <img width="100" src={node.img} alt="" />}
                  </div>
                  {node.spouse && !node.divorced && (
                    <div className="marital-line"></div>
                  )}
                  {node.spouse && node.divorced && (
                    <div className="marital-line-divorced"></div>
                  )}
                  {node.spouse &&
                    this.props.tree
                      .filter(data => {
                        return data.id === node.spouse;
                      })
                      .map((n, k) => {
                        return (
                          <div
                            key={k}
                            className={
                              'node' +
                              (n.status === 'deceased' ? ' node-deceased' : '')
                            }
                            onClick={() => {
                              n.mode = 'edit';
                              n.scene = 'form';
                              this.props.showModal(n);
                            }}>
                            {n.name}
                          </div>
                        );
                      })}
                  {node.hasChildren && <div className="derivative-line"></div>}
                  {node.hasChildren && (
                    <div>
                      <Node
                        tree={this.props.tree}
                        parents={[node.id, node.spouse]}
                        showModal={this.props.showModal}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}

const Node = translate('translations')(NodeLegacy);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'tree',
      tree: JSON.parse(window.localStorage.getItem('tree')) || tree,
      isNew: window.localStorage.getItem('tree') ? false : true,
      scale: 1.0,
      showModalExport: false,
    };
    this.pdfRef = React.createRef();
  }
  componentDidMount = () => {
    // let familyTree;
    this.resizeTreeWidth();
    if (this.state.isNew) {
      setTimeout(() => {
        if (!window.localStorage.getItem('isReset')) {
          alert(this.props.t('welcomeAlert'));
        }
        window.localStorage.removeItem('isReset');
      }, 500);
    }
  };

  // This help draggable scroll
  resizeTreeWidth = () => {
    setTimeout(() => {
      if (this.state.currentTab === 'tree') {
        document
          .getElementById('main-wrapper')
          .style.setProperty(
            'width',
            document.getElementById('root-family').offsetWidth + 100 + 'px',
          );
      }
    }, 100);
  };

  showModal = obj => {
    this.setState({modal: true, node: obj});
  };

  reset = () => {
    if (window.confirm(this.props.t('resetConfirm'))) {
      window.localStorage.removeItem('tree');
      window.localStorage.setItem('isReset', 'true');
      window.location = prefix;
    }
  };

  zoomIn = () => {
    let scale = this.state.scale;
    scale += 0.1;
    if (scale > 1) return;
    this.setState({scale: scale}, () => {
      document
        .getElementById('main-wrapper')
        .style.setProperty('transform', 'scale(' + scale + ')');
    });
  };

  zoomOut = () => {
    let scale = this.state.scale;
    scale -= 0.1;
    this.setState({scale: scale}, () => {
      document
        .getElementById('main-wrapper')
        .style.setProperty('transform', 'scale(' + scale + ')');
    });
  };

  onSearchChange = e => {
    console.log(e.target.value);
    this.setState({search: e.target.value});
  };

  // Import data from JSON file
  import = () => {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = readerEvent => {
        var content = readerEvent.target.result;
        try {
          let tree = JSON.parse(content);
          window.localStorage.setItem('tree', JSON.stringify(tree));
          window.location = prefix;
        } catch (err) {
          alert(err);
        }
      };
    };
    input.click();
  };

  // Export data to JSON file
  export = () => {
    let jsonStr = JSON.stringify(this.state.tree);
    var pom = document.createElement('a');
    pom.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr),
    );
    pom.setAttribute(
      'download',
      'lineage-' + new Date().toISOString().replace(/:/g, '-') + '.json',
    );

    if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    } else {
      pom.click();
    }
  };

  initExport = () => {
    this.setState({
      showModalExport: true,
    });
  };

  render() {
    const {t, i18n} = this.props;
    const pdfWidth = window.document.getElementById('main-wrapper')
      ? parseInt(window.document.getElementById('main-wrapper').clientWidth) *
        (75 / 100)
      : 0;
    const pdfHeight = window.document.getElementById('main-wrapper')
      ? parseInt(window.document.getElementById('main-wrapper').clientHeight)
      : 0;
    return (
      <div className="App">
        <div className="i18n">
          <span
            className={'i18n-options'}
            onClick={() => {
              i18n.changeLanguage('en');
            }}>
            English
          </span>
          &nbsp;/&nbsp;
          <span
            className={'i18n-options'}
            onClick={() => {
              i18n.changeLanguage('id');
            }}>
            Bahasa Indonesia
          </span>
        </div>
        <div className="header">
          <div style={{height: 23}}>&nbsp;</div>
          <div>
            <div
              className={
                'main-menu-item' +
                (this.state.currentTab === 'list'
                  ? ' main-menu-item-selected'
                  : '')
              }
              onClick={() => {
                console.log(JSON.stringify(this.state.node));
                window.localStorage.setItem(
                  'tree',
                  JSON.stringify(this.state.tree),
                );
                this.setState({currentTab: 'list'});
              }}>
              {t('List')}
            </div>
            <div
              className={
                'main-menu-item' +
                (this.state.currentTab === 'tree'
                  ? ' main-menu-item-selected'
                  : '')
              }
              onClick={() => {
                if (this.state.currentTab === 'tree') return;
                window.location = prefix;
              }}>
              {t('Tree')}
            </div>
          </div>
          <div className="tools">
            <button onClick={this.import}>{t('Import')}</button>&nbsp;&nbsp;
            <button onClick={this.initExport}>{t('Export')}</button>&nbsp;&nbsp;
            <button onClick={this.reset}>{t('Reset')}</button>&nbsp;&nbsp;
            {this.state.currentTab === 'tree' && (
              <div style={{display: 'inline-block', color: 'grey'}}>
                <button onClick={this.zoomIn}>{t('Zoom in')}</button>
                &nbsp;&nbsp;
                <button onClick={this.zoomOut}>{t('Zoom out')}</button>
                {/* Legenda*/}
                <div
                  style={{
                    marginLeft: 10,
                    width: 15,
                    height: 3,
                    background: 'blue',
                    display: 'inline-block',
                  }}></div>
                <span style={{fontSize: 12, paddingLeft: 5}}>
                  {t('Original derivatives')}
                </span>
                <div
                  style={{
                    marginLeft: 10,
                    width: 15,
                    height: 3,
                    background: 'green',
                    display: 'inline-block',
                  }}></div>
                <span style={{fontSize: 12, paddingLeft: 5}}>
                  {t('Outsider')}
                </span>
                <div
                  style={{
                    marginLeft: 10,
                    width: 15,
                    height: 3,
                    background: 'red',
                    display: 'inline-block',
                  }}></div>
                <span style={{fontSize: 12, paddingLeft: 5}}>
                  {t('Divorced')}
                </span>
                <div
                  style={{
                    verticalAlign: 'bottom',
                    marginBottom: 2,
                    marginLeft: 10,
                    width: 15,
                    height: 15,
                    background: 'grey',
                    display: 'inline-block',
                  }}></div>
                <span style={{fontSize: 12, paddingLeft: 5}}>
                  {t('Deceased')}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* List */}
        {this.state.currentTab === 'list' && (
          <div className="family-list">
            <div className="family-list-sidebar">
              <div>
                <div className="family-list-buttons">
                  <div
                    className="family-list-button"
                    onClick={() => {
                      this.setState({form: false}, () => {
                        this.setState({
                          form: true,
                          node: {
                            name: '',
                            fullName: '',
                            birthPlace: '',
                            birthDate: '',
                            city: '',
                            contact: '',
                            gender: 'male',
                            status: 'alive',
                            firstParent: '',
                            secondParent: '',
                            exs: [],
                            mode: 'new',
                          },
                        });
                      });
                    }}>
                    {t('Add')}
                  </div>
                </div>
                <input
                  placeholder={t('Search')}
                  className="search-box"
                  type="text"
                  onChange={this.onSearchChange}
                />
              </div>
              <div className="family-list-items">
                {this.state.tree
                  .filter(data => {
                    if (
                      data.id === '00000000-0000-0000-0000-00000000000' ||
                      data.id === '0'
                    ) {
                      return false;
                    }
                    if (!data.name) {
                      return false;
                    }
                    if (
                      data &&
                      data.name &&
                      this.state.search &&
                      this.state.search.length > 0
                    ) {
                      return (
                        data.name
                          .toLowerCase()
                          .indexOf(this.state.search.toLowerCase()) > -1
                      );
                    } else {
                      return true;
                    }
                  })
                  .map((item, key) => {
                    return (
                      <div
                        key={key}
                        className={
                          'family-list-item' +
                          (this.state.node && this.state.node.id === item.id
                            ? ' family-list-item-selected'
                            : '')
                        }
                        onClick={() => {
                          let node = item;
                          node.mode = 'edit';
                          this.setState({form: false}, () => {
                            this.setState({form: true, node: node});
                          });
                        }}>
                        {item.name}
                      </div>
                    );
                  })}
              </div>
            </div>
            {this.state.form && (
              <div className="family-list-content">
                <Form tree={this.state.tree} node={this.state.node} />
              </div>
            )}
          </div>
        )}

        {/* Tree */}
        {this.state.currentTab === 'tree' && (
          <div className="family-tree">
            {/* Family tree */}
            <div className="dragscroll">
              <div id="main-wrapper" ref={this.pdfRef}>
                <Node
                  tree={this.state.tree}
                  parents={[this.state.tree[0].id]}
                  root={true}
                  showModal={this.showModal}
                />
              </div>
            </div>
          </div>
        )}
        {/* Modal */}
        {this.state.modal && (
          <div className="modal">
            <div className="modal-content">
              <div className="close-container">
                <div
                  className="close"
                  onClick={() => {
                    this.setState({modal: false, node: {}});
                  }}>
                  <span role="img" aria-label="">
                    &#10060;{' '}
                  </span>
                </div>
              </div>
              <Form tree={this.state.tree} node={this.state.node} />
            </div>
          </div>
        )}
        <Modal
          show={this.state.showModalExport}
          handleClose={() => {
            this.setState({showModalExport: false});
          }}
          content={
            <div>
              <h4>{t('Export')}</h4>
              <button onClick={this.export}>{t('Export to JSON')}</button>
              &nbsp;
              <ExportPDF
                targetRef={this.pdfRef}
                options={{
                  orientation: 'landscapce',
                  unit: 'px',
                  format: [pdfWidth, pdfHeight],
                }}
                filename={
                  'lineage-' +
                  new Date().toISOString().replace(/:/g, '-') +
                  '.pdf'
                }>
                {({toPdf}) => (
                  <button onClick={toPdf}>{t('Export to PDF')}</button>
                )}
              </ExportPDF>
            </div>
          }
        />
      </div>
    );
  }
}

export default translate('translations')(App);

class FormLegacy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scene: 'form',
    };
  }
  componentDidMount = () => {
    let obj = JSON.parse(JSON.stringify(this.props.node));
    // Parse parent
    if (obj.parents && obj.parents[0]) {
      for (let i in this.props.tree) {
        if (this.props.tree[i].id === obj.parents[0]) {
          obj.firstParent = this.props.tree[i].name;
          break;
        }
      }
    }
    if (obj.parents && obj.parents[1]) {
      for (let i in this.props.tree) {
        if (this.props.tree[i].id === obj.parents[1]) {
          obj.secondParent = this.props.tree[i].name;
          break;
        }
      }
    }
    // Parse spouse
    if (obj.spouse && obj.spouse.length > 0) {
      for (let i in this.props.tree) {
        if (this.props.tree[i].id === obj.spouse) {
          obj.spouseName = this.props.tree[i].name;
          break;
        }
      }
    }
    // Parse exs
    if (obj.exs && obj.exs.length > 0) {
      for (let i in this.props.tree) {
        if (this.props.tree[i].id === obj.exs[0].id) {
          obj.exName = this.props.tree[i].name;
          break;
        }
      }
    }
    this.setState(obj);
  };
  onChange = e => {
    if (e && e.target && e.target.name && e.target.value) {
      let obj = {};
      obj[e.target.name] = e.target.value;
      this.setState(obj);
    }
  };

  remove = () => {
    if (
      !window.confirm(
        this.props.t('Are you sure that you want to remove this node?'),
      )
    ) {
      return;
    }
    this.setState({search: null});
    let tree = this.props.tree;
    for (let i in tree) {
      console.log(tree[i]);
      if (tree[i].id === this.state.id) {
        tree.splice(i, 1);
        break;
      }
    }
    window.localStorage.setItem('tree', JSON.stringify(tree));
    window.location = prefix;
  };
  save = () => {
    this.setState({search: null});
    let tree = this.props.tree;
    for (let i in tree) {
      if (tree[i].id === this.state.id) {
        tree[i] = {
          id: this.state.id,
          name: this.state.name,
          fullName: this.state.fullName,
          birthPlace: this.state.birthPlace,
          birthDate: this.state.birthDate,
          city: this.state.city,
          contact: this.state.contact,
          gender: this.state.gender,
          status: this.state.status,
          firstParent: this.state.firstParent,
          secondParent: this.state.secondParent,
          parents: this.state.parents,
          spouse: this.state.spouse,
          exs: this.state.exs || [],
        };
        console.log(tree[i]);
        break;
      }
    }
    window.localStorage.setItem('tree', JSON.stringify(tree));
    window.location = prefix;
  };
  add = () => {
    this.setState({search: null});
    let tree = this.props.tree;
    tree.push({
      id: uuidv4(),
      name: this.state.name,
      fullName: this.state.fullName,
      birthPlace: this.state.birthPlace,
      birthDate: this.state.birthDate,
      city: this.state.city,
      contact: this.state.contact,
      gender: this.state.gender,
      status: this.state.status,
      firstParent: this.state.firstParent,
      secondParent: this.state.secondParent,
      parents: this.state.parents,
      spouse: this.state.spouse,
      exs: this.state.exs || [],
    });
    window.localStorage.setItem('tree', JSON.stringify(tree));
    window.location = prefix;
  };
  onSearchChange = e => {
    console.log(e.target.value);
    this.setState({search: e.target.value});
  };
  render() {
    const {t, i18n} = this.props;
    return (
      <div>
        {this.state.scene === 'selectParent' && (
          <div>
            <div className="select-for-label">
              {t('Select parent for')} {this.state.name}
            </div>
            <input
              placeholder={t('Search')}
              className="search-box"
              type="text"
              onChange={this.onSearchChange}
            />

            <div className="family-list-items">
              {this.props.tree &&
                this.props.tree
                  .filter(data => {
                    if (
                      data.id === '00000000-0000-0000-0000-00000000000' ||
                      data.id === '0'
                    ) {
                      return false;
                    }
                    if (!data.name) {
                      return false;
                    }
                    if (
                      data &&
                      data.name &&
                      this.state.search &&
                      this.state.search.length > 0
                    ) {
                      return (
                        data.name
                          .toLowerCase()
                          .indexOf(this.state.search.toLowerCase()) > -1
                      );
                    } else {
                      return true;
                    }
                  })
                  .map((item, key) => {
                    return (
                      <div
                        key={key}
                        className="family-list-item"
                        onClick={() => {
                          let node = item;
                          let parents = this.state.parents || [];
                          console.log(parents);
                          if (parents && parents.length === 0) {
                            parents.push(node.id);
                            this.setState({
                              firstParent: node.name,
                              parents: parents,
                              scene: 'form',
                            });
                          } else if (parents) {
                            parents.push(node.id);
                            this.setState({
                              secondParent: node.name,
                              parents: parents,
                              scene: 'form',
                            });
                          }
                        }}>
                        {item.name}
                      </div>
                    );
                  })}
            </div>
          </div>
        )}
        {this.state.scene === 'selectSpouse' && (
          <div>
            <div className="select-for-label">
              {t('Select spouse for')} {this.state.name}
            </div>
            <input
              placeholder={t('Search')}
              className="search-box"
              type="text"
              onChange={this.onSearchChange}
            />

            <div className="family-list-items">
              {this.props.tree &&
                this.props.tree
                  .filter(data => {
                    if (
                      data.id === '00000000-0000-0000-0000-00000000000' ||
                      data.id === '0'
                    ) {
                      return false;
                    }
                    if (!data.name) {
                      return false;
                    }
                    if (
                      data &&
                      data.name &&
                      this.state.search &&
                      this.state.search.length > 0
                    ) {
                      return (
                        data.name
                          .toLowerCase()
                          .indexOf(this.state.search.toLowerCase()) > -1
                      );
                    } else {
                      return true;
                    }
                  })
                  .map((item, key) => {
                    return (
                      <div
                        key={key}
                        className="family-list-item"
                        onClick={() => {
                          let node = item;
                          this.setState({
                            spouseName: node.name,
                            spouse: node.id,
                            scene: 'form',
                          });
                        }}>
                        {item.name}
                      </div>
                    );
                  })}
            </div>
          </div>
        )}
        {this.state.scene === 'selectEx' && (
          <div>
            <div className="select-for-label">
              {t('Select ex for')} {this.state.name}
            </div>
            <input
              placeholder={t('Search')}
              className="search-box"
              type="text"
              onChange={this.onSearchChange}
            />

            <div className="family-list-items">
              {this.props.tree &&
                this.props.tree
                  .filter(data => {
                    if (
                      data.id === '00000000-0000-0000-0000-00000000000' ||
                      data.id === '0'
                    ) {
                      return false;
                    }
                    if (!data.name) {
                      return false;
                    }
                    if (
                      data &&
                      data.name &&
                      this.state.search &&
                      this.state.search.length > 0
                    ) {
                      return (
                        data.name
                          .toLowerCase()
                          .indexOf(this.state.search.toLowerCase()) > -1
                      );
                    } else {
                      return true;
                    }
                  })
                  .map((item, key) => {
                    return (
                      <div
                        key={key}
                        className="family-list-item"
                        onClick={() => {
                          let node = item;
                          this.setState({
                            exName: node.name,
                            exs: [{id: node.id}],
                            scene: 'form',
                          });
                        }}>
                        {item.name}
                      </div>
                    );
                  })}
            </div>
          </div>
        )}
        {this.state.scene === 'form' && (
          <div>
            <div className="family-list-form">
              <div className="family-list-form-label">{t('Name')}</div>
              <input
                name="name"
                placeholder={t('Name')}
                className="family-list-form-input"
                type="text"
                value={this.state.name}
                onChange={this.onChange}
              />
            </div>
            <div className="family-list-form">
              <div className="family-list-form-label">{t('Full name')}</div>
              <input
                name="fullName"
                placeholder={t('Full name')}
                className="family-list-form-input"
                type="text"
                value={this.state.fullName}
                onChange={this.onChange}
              />
            </div>
            <div className="family-list-form">
              <div className="family-list-form-label">{t('Birth place')}</div>
              <input
                name="birthPlace"
                placeholder={t('Birth place')}
                className="family-list-form-input"
                type="text"
                value={this.state.birthPlace}
                onChange={this.onChange}
              />
            </div>
            <div className="family-list-form">
              <div className="family-list-form-label">{t('Birth date')}</div>
              <input
                name="birthDate"
                placeholder={t('Birth place')}
                className="family-list-form-input"
                type="text"
                value={this.state.birthDate}
                onChange={this.onChange}
              />
            </div>
            <div className="family-list-form">
              <div className="family-list-form-label">{t('City')}</div>
              <input
                name="city"
                placeholder={t('City')}
                className="family-list-form-input"
                type="text"
                value={this.state.city}
                onChange={this.onChange}
              />
            </div>
            <div className="family-list-form">
              <div className="family-list-form-label">{t('Contact')}</div>
              <input
                name="contact"
                placeholder={t('Contact')}
                className="family-list-form-input"
                type="text"
                value={this.state.contact}
                onChange={this.onChange}
              />
            </div>
            <div className="family-list-form">
              <div className="family-list-form-label">{t('Gender')}</div>
              <div className="family-list-form-free-input">
                <span
                  className={
                    'radio' +
                    (this.state.gender === 'male' ? ' radio-selected' : '')
                  }
                  onClick={() => {
                    this.setState({gender: 'male'});
                  }}>
                  {t('Male')}
                </span>
                <span
                  className={
                    'radio' +
                    (this.state.gender === 'female' ? ' radio-selected' : '')
                  }
                  onClick={() => {
                    this.setState({gender: 'female'});
                  }}>
                  {t('Female')}
                </span>
                <span
                  className={
                    'radio' +
                    (this.state.gender === 'other' ? ' radio-selected' : '')
                  }
                  onClick={() => {
                    this.setState({gender: 'other'});
                  }}>
                  {t('Other')}
                </span>
              </div>
            </div>
            <div className="family-list-form">
              <div className="family-list-form-label">Status</div>
              <div className="family-list-form-free-input">
                <span
                  className={
                    'radio' +
                    (this.state.status === 'alive' ? ' radio-selected' : '')
                  }
                  onClick={() => {
                    this.setState({status: 'alive'});
                  }}>
                  {t('Alive')}
                </span>
                <span
                  className={
                    'radio' +
                    (this.state.status === 'deceased' ? ' radio-selected' : '')
                  }
                  onClick={() => {
                    this.setState({status: 'deceased'});
                  }}>
                  {t('Deceased')}
                </span>
              </div>
            </div>
            {/* Hide if its a root node */}
            {!(
              this.state.parents &&
              this.state.parents[0] &&
              (this.state.parents[0] ===
                '00000000-0000-0000-0000-00000000000' ||
                this.state.parents[0] === '0')
            ) && (
              <div className="family-list-form">
                <div className="family-list-form-label">{t('1st Parent')}</div>
                <div className="family-list-form-free-input">
                  <span
                    className={
                      'radio' +
                      (this.state.parents && this.state.parents[0]
                        ? ' radio-selected'
                        : '')
                    }
                    onClick={() => {
                      this.setState({search: ''}, () => {
                        if (
                          !(
                            this.state.parents &&
                            this.state.parents[0] &&
                            this.state.firstParent
                          )
                        ) {
                          this.setState({scene: 'selectParent'});
                        }
                      });
                    }}>
                    {this.state.parents &&
                      this.state.parents[0] &&
                      this.state.firstParent}
                    {!(
                      this.state.parents &&
                      this.state.parents[0] &&
                      this.state.firstParent
                    ) && t('Select')}
                  </span>
                  {this.state.parents &&
                    this.state.parents[0] &&
                    this.state.firstParent && (
                      <div
                        className="remove-button-small"
                        onClick={() => {
                          if (
                            this.state.parents &&
                            this.state.parents.length > 1
                          ) {
                            let parents = this.state.parents;
                            parents = [this.state.parents[1]];
                            let firstParent = this.state.secondParent;
                            this.setState({
                              parents: parents,
                              firstParent: firstParent,
                              secondParent: null,
                            });
                          } else {
                            let parents = [];
                            this.setState({
                              parents: parents,
                              firstParent: null,
                              secondParent: null,
                            });
                          }
                        }}>
                        -
                      </div>
                    )}
                </div>
              </div>
            )}
            {/* Hide if its a root node */}
            {!(
              this.state.parents &&
              this.state.parents[0] &&
              (this.state.parents[0] ===
                '00000000-0000-0000-0000-00000000000' ||
                this.state.parents[0] === '0')
            ) && (
              <div className="family-list-form">
                <div className="family-list-form-label">{t('2nd Parent')}</div>
                <div className="family-list-form-free-input">
                  <span
                    className={
                      'radio' +
                      (this.state.parents && this.state.parents[1]
                        ? ' radio-selected'
                        : '')
                    }
                    onClick={() => {
                      this.setState({search: ''}, () => {
                        if (
                          !(
                            this.state.parents &&
                            this.state.parents[1] &&
                            this.state.secondParent
                          )
                        ) {
                          this.setState({scene: 'selectParent'});
                        }
                      });
                    }}>
                    {this.state.parents &&
                      this.state.parents[1] &&
                      this.state.secondParent}
                    {!(
                      this.state.parents &&
                      this.state.parents[1] &&
                      this.state.secondParent
                    ) && t('Select')}
                  </span>
                  {this.state.parents &&
                    this.state.parents[1] &&
                    this.state.secondParent && (
                      <div
                        className="remove-button-small"
                        onClick={() => {
                          let parents = [this.state.parents[0]];
                          this.setState({
                            parents: parents,
                            secondParent: null,
                          });
                        }}>
                        -
                      </div>
                    )}
                </div>
              </div>
            )}
            <div className="family-list-form">
              <div className="family-list-form-label">{t('Spouse')}</div>
              <div className="family-list-form-free-input">
                <span
                  className={
                    'radio' +
                    (this.state.spouse && this.state.spouse.length > 0
                      ? ' radio-selected'
                      : '')
                  }
                  onClick={() => {
                    this.setState({search: ''}, () => {
                      if (!this.state.spouse) {
                        this.setState({scene: 'selectSpouse'});
                      }
                    });
                  }}>
                  {this.state.spouseName}
                  {!(this.state.spouse && this.state.spouse.length > 0) &&
                    t('Select')}
                </span>
                {this.state.spouse && this.state.spouse && (
                  <div
                    className="remove-button-small"
                    onClick={() => {
                      this.setState({
                        spouseName: null,
                        spouse: null,
                      });
                    }}>
                    -
                  </div>
                )}
              </div>
            </div>
            <div className="family-list-form">
              <div className="family-list-form-label">{t('Exs')}</div>
              <div className="family-list-form-free-input">
                <span
                  className={
                    'radio' +
                    (this.state.exs && this.state.exs.length > 0
                      ? ' radio-selected'
                      : '')
                  }
                  onClick={() => {
                    this.setState({search: ''}, () => {
                      if (!(this.state.exs && this.state.exs.length > 0)) {
                        this.setState({scene: 'selectEx'});
                      }
                    });
                  }}>
                  {this.state.exName}
                  {!(
                    (this.state.ex && this.state.exs.length > 0) ||
                    (this.state.exName && this.state.exName.length > 0)
                  ) && t('Select')}
                </span>
                {this.state.exs && this.state.exs.length > 0 && (
                  <div
                    className="remove-button-small"
                    onClick={() => {
                      this.setState({
                        exName: null,
                        exs: [],
                      });
                    }}>
                    -
                  </div>
                )}
              </div>
            </div>
            <div className="family-list-form">
              <div className="family-list-form-label"></div>
              {this.state.mode === 'edit' && (
                <div className="family-list-form-free-input">
                  <div
                    className="button"
                    onClick={() => {
                      this.remove(this.state.id);
                    }}>
                    {t('Remove')}
                  </div>
                  <div
                    className="button"
                    onClick={() => {
                      this.save();
                    }}>
                    {t('Save')}
                  </div>
                </div>
              )}
              {this.state.mode === 'new' && (
                <div className="family-list-form-free-input">
                  <div
                    className="button"
                    onClick={() => {
                      this.add();
                    }}>
                    {t('Add')}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const Form = translate('translations')(FormLegacy);
