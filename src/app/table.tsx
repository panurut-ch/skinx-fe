import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { useRouter } from "next/navigation";
import DetailPopup from "./detail";

export default function Table() {
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagOptions, setTagOptions] = useState([]);
  const [perpage, setPerpage] = useState(10);
  const [page, setPage] = useState(2);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTagOptions = async () => {
      try {
        const bearerToken = localStorage.getItem("accessToken");
        if (!bearerToken) {
          console.error("Bearer token not found in local storage.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${bearerToken}`,
        };

        const endpoint = "http://localhost:3001/posts/all-tag";
        const response = await axios.get(endpoint, { headers });

        setTagOptions(response.data);
      } catch (error) {
        console.error("Error fetching tag options:", error);
      }
    };

    fetchTagOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data, totalRows } = await fetchData_fn(
        1,
        "id",
        "asc",
        keyword,
        selectedTag,
        perpage
      );
      setData(data);
      setTotalRows(totalRows);
      setTotalPages(Math.ceil(totalRows / perpage));
    };

    fetchData();
  }, [keyword, selectedTag, router, perpage]);

  const fetchData_fn = async (
    page,
    sortbycolumn,
    orderby,
    keyword = "",
    tag = "",
    perpage
  ) => {
    try {
      const bearerToken = localStorage.getItem("accessToken");
      if (!bearerToken) {
        console.error("Bearer token not found in local storage.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${bearerToken}`,
      };

      let endpoint = "http://localhost:3001/posts/all";

      if (keyword) {
        endpoint = "http://localhost:3001/posts/search";
      } else if (tag && !keyword) {
        endpoint = "http://localhost:3001/posts/tag";
      }
      const response = await axios.post(
        endpoint,
        {
          keyword,
          tag: tag ? tag.name : null,
          page,
          perpage,
          sortbycolumn,
          orderby,
        },
        { headers }
      );

      return {
        data: response.data.data,
        totalRows: response.data.total,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response && error.response.status === 401) {
        router.push("/login");
      }
      return {
        data: [],
        totalRows: 0,
      };
    }
  };

  const handleKeywordSearch = (keyword) => {
    setKeyword(keyword);
  };

  const columns = [
    { name: "id", label: "ID", options: { filter: false } },
    { name: "title", label: "Title", options: { filter: false } },
    {
      name: "content",
      label: "Content",
      options: {
        customBodyRender: (value) => (
          <div style={{ maxHeight: "3em", overflow: "hidden" }}>{value}</div>
        ),
        filter: false,
      },
    },
    { name: "postedAt", label: "Posted At", options: { filter: false } },
    { name: "postedBy", label: "Posted By", options: { filter: false } },
    {
      name: "tags",
      label: "Tags",
      options: {
        filter: true,
        filterType: "multiselect",
        customBodyRender: (value) => value.map((tag) => tag.name).join(", "),
      },
    },
  ];

  const options = {
    jumpToPage: true,
    filterType: "checkbox",
    download: false,
    print: false,
    selectableRows: "none",
    serverSide: false,
    count: totalRows,
    rowsPerPage: perpage,
    page: 0,
    pagination: true,
    rowsPerPageOptions: [5, 10, 15, 20, 50],
    searchText: keyword,
    search: false,
    onSearchChange: (searchText) => handleKeywordSearch(searchText),
    onTableChange: (action, tableState) => {
      if (
        action === "changePage" ||
        action === "changeRowsPerPage" ||
        action === "jumpToPage"
      ) {
        const newPerpage = tableState.rowsPerPage;
        const nextPage =
          action === "changePage"
            ? tableState.page + 1
            : action === "jumpToPage"
            ? tableState.page
            : page;
        const sortbycolumn = "id";
        const orderby = "asc";

        fetchData_fn(
          nextPage,
          sortbycolumn,
          orderby,
          keyword,
          selectedTag,
          newPerpage
        ).then(({ data, totalRows }) => {
          setData(data);
          setTotalRows(totalRows);
          setTotalPages(Math.ceil(totalRows / newPerpage));
          if (action === "changeRowsPerPage") {
            setPerpage(newPerpage);
          }
        });
      }
    },
    onRowClick: (rowData) => {
      setSelectedRowData(rowData);
      setShowPopup(true);
    },
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <Grid
      container
      justifyContent="center"
      spacing={2}
      style={{ marginTop: "20px" }}
    >
      <Grid item xs={12} md={5} style={{ margin: "1px" }}>
        <TextField
          fullWidth
          type="text"
          placeholder="Search by Keyword..."
          value={keyword}
          onChange={(e) => handleKeywordSearch(e.target.value)}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={5} style={{ margin: "1px" }}>
        <Autocomplete
          fullWidth
          options={tagOptions}
          getOptionLabel={(option) => option.name}
          value={selectedTag}
          onChange={(event, newValue) => {
            setSelectedTag(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Search by Tag" variant="outlined" />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <div style={{ margin: "50px" }}>
          <MUIDataTable
            title={"Post List"}
            data={data}
            columns={columns}
            options={options}
            tableId="post-list-id"
          />
        </div>
      </Grid>
      <DetailPopup
        open={showPopup}
        selectedRowData={selectedRowData}
        onClose={closePopup}
      />
    </Grid>
  );
}
