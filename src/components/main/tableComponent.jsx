import {useState, useEffect} from "react";
import {DataGrid} from "@mui/x-data-grid";

export default function ServerPaginationGrid({
                                               pageSize,
                                               rowCount,
                                               rows,
                                               columns,
                                               loading,
                                               onPageChange,
                                               onPageSizeChange,
                                               onPageAlter,
                                               handleRowClick,
                                               ...props
                                             }) {
  const [localPage, setLocalPage] = useState(0);
  const [localPageSize, setLocalPageSize] = useState(10);
  const [rowCountState, setRowCountState] = useState(rowCount || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState) => rowCount || prevRowCountState);
  }, [rowCount, setRowCountState]);

  useEffect(() => {
    setLocalPage(props.page);
  }, [props.page, pageSize]);

  // console.log("rowCountState", rowCount);
  return (<DataGrid
    autoHeight
    getRowHeight={() => 'auto'}
    rows={rows}
    rowCount={rowCountState}
    loading={loading}
    rowsPerPageOptions={[1, 2, 3, 10]}
    pageSizeOptions={[1, 2, 3,10]}
    pagination
    page={localPage}
    pageSize={pageSize ?? localPageSize}
    paginationMode="server"
    onRowClick={handleRowClick}
    onPageChange={(page, details) => {
      // console.log("page inside onPage:", page, "localpage:", localPage);
      onPageAlter(page);
      if (props?.onPageChange) {
        props?.onPageChange(page, details);
      }
      setLocalPage(page);
    }}
    onPageSizeChange={(pageSize, details) => {
      if (onPageSizeChange) {
        onPageSizeChange(pageSize, details);
      }
      setLocalPageSize(pageSize);
    }}
    columns={columns}
  />);
}
