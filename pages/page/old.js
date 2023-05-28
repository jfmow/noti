import MyComponent from "@/components/Item";

export default function TestPg({page}){
    return(
        <MyComponent currPage={page}/>
    )
}

export async function getServerSideProps({ params }) {
    return {
        props: {
            page: params.id,
        },
    };
  }