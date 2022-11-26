import {deleteStudent, getAllStudent} from "./client";
import {useEffect, useState} from "react";

import {Layout, Menu, Breadcrumb, Table, Spin, Empty, Button, Tag, Badge, Popconfirm, Radio} from 'antd';
import {
    DesktopOutlined, PieChartOutlined, FileOutlined,
    TeamOutlined, UserOutlined, LoadingOutlined, PlusOutlined,
} from '@ant-design/icons';

import './App.css';
import StudentDrawerForm from "./StudentDrawerForm";
import {errorNotification, successNotification} from "./Notification";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification( "Student deleted", `Student with ID: ${studentId} was deleted`);
    })
        .catch(err => {
            err.response.json()
                .then(res => {
                    errorNotification("Error Occurred", res.message)
                })
        })
        .finally(() => callback());
}

const columns = fetchStudents => [
    {
        title: 'Id', dataIndex: 'id', key: 'id',
    },
    {
        title: 'Name', dataIndex: 'name', key: 'name',
    },
    {
        title: 'Email', dataIndex: 'email', key: 'email',
    },
    {
        title: 'Gender', dataIndex: 'gender', key: 'gender',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${student.name}`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small">Edit</Radio.Button>
            </Radio.Group>
    }
];

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);


    const fetchStudents = () =>
        getAllStudent()
            .then(res => res.json())
            .then(data => {
                setStudents(data)
            })
            .catch(err => {
                err.response.json()
                    .then(res => errorNotification(
                        "Something Went Wrong",
                        `${err.message} [${err.status}]`
                    ));
            })
            .finally(() => setFetching(false));

    useEffect(() => {
        fetchStudents();
    }, []);

    const renderStudents = () => {
        if (fetching) return <Spin indicator={antIcon} />;
        if(students.length < 1) {
            return (
            <>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Button onClick={() => setShowDrawer(!showDrawer)} type="primary" shape="round" icon={<PlusOutlined />} size="small">
                    Add New Student
                </Button>
                <Empty />
            </>
        );}

        return (<>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            <Table
                dataSource={students}
                columns={columns(fetchStudents)}
                bordered
                title={() =>
                    <>
                        <Button onClick={() => setShowDrawer(!showDrawer)} type="primary" shape="round" icon={<PlusOutlined />} size="small">
                            Add New Student
                        </Button>
                    </>
                }
                footer={() =>
                    <>
                        <Tag>Number of students</Tag>
                        <Badge count={students.length} className="site-badge-count-4"/>
                    </>
                }
                pagination={{ pageSize: 50 }}
                scroll={{ y: 600 }}
                rowKey={students => students.id}
            />
        </>);
    }

  return (
      <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
              <div className="logo" />
              <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                  <Menu.Item key="1" icon={<PieChartOutlined />}>
                      Option 1
                  </Menu.Item>
                  <Menu.Item key="2" icon={<DesktopOutlined />}>
                      Option 2
                  </Menu.Item>
                  <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                      <Menu.Item key="3">Tom</Menu.Item>
                      <Menu.Item key="4">Bill</Menu.Item>
                      <Menu.Item key="5">Alex</Menu.Item>
                  </SubMenu>
                  <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                      <Menu.Item key="6">Team 1</Menu.Item>
                      <Menu.Item key="8">Team 2</Menu.Item>
                  </SubMenu>
                  <Menu.Item key="9" icon={<FileOutlined />}>
                      Files
                  </Menu.Item>
              </Menu>
          </Sider>
          <Layout className="site-layout">
              <Header className="site-layout-background" style={{ padding: 0 }} />
              <Content style={{ margin: '0 16px' }}>
                  <Breadcrumb style={{ margin: '16px 0' }}>
                      <Breadcrumb.Item>Students</Breadcrumb.Item>
                      <Breadcrumb.Item>All</Breadcrumb.Item>
                  </Breadcrumb>
                  <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                      {renderStudents()}
                  </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>Decagon ©2022</Footer>
          </Layout>
      </Layout>
  );
}

export default App;
